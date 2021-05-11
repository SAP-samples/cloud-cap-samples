function getEntity(absoluteName) {
  const [serviceName, entityName] = absoluteName.split(".");
  return cds.services[serviceName].entities[entityName];
}

function fixColumnName(entity, name) {
  const fullName = `${entity.name}.${name}`;
  return RemoteHandler.columnNameFixes[fullName] || name;
}

function associationLink(entity, associationName) {
  const association = entity.associations[associationName];
  const cardinalityMax = association.cardinality && association.cardinality.max;
  if (!association)
    throw new Error(
      `Association "${associationName}" does not exists for entity "${entity.name}".`
    );
  if (association.keys) {
    return associationKey(entity, association);
  }

  if (association.on && association.on.length === 3 && association.on[0].ref[0] === associationName && association.on[1] === "=" ) {
    const keyFieldName = fixColumnName(entity, association.on[2].ref[0]);
    const targetKeyFieldName = association.on[0].ref.slice(1).join("_");
    return [keyFieldName, targetKeyFieldName, association.target, cardinalityMax];
  }

  if (association.on) {
    const { reverseAssociationName } = associationOn(entity, association);
    const targetEntity = getEntity(association.target);
    const reverseAssociation =
      targetEntity.associations[reverseAssociationName];
    const [targetKeyFieldName, keyFieldName] = associationKey(
      targetEntity,
      reverseAssociation
    );
    return [keyFieldName, targetKeyFieldName, association.target, cardinalityMax];
  }

  throw new Error(
    `Association "${associationName}" of entity "${entity.name}" has no "on" and no "keys".`
  );
}

function associationOn(entity, association) {
  if (
    !association.on.length === 3 ||
    association.on[1] !== "=" ||
    association.on[2].ref[0] !== "$self"
  )
    throw new Error(
      `Association "${association.name}" for "${entity.name}" has not the expected form.`
    );

  const reverseAssociationName = association.on[0].ref[1];
  const [targetServiceName, targetEntityName] = association.target.split(".");
  return { targetServiceName, targetEntityName, reverseAssociationName };
}

function associationKey(entity, association) {
  const key = association.keys && association.keys[0];
  if (!key)
    throw new Error(
      `Association "${association.name}" for entity "${entity.name}" has no keys.`
    );
  return [key["$generatedFieldName"], key.ref[0], association.target, association.cardinality.max];
}

class RemoteHandler {
  constructor(service, remoteEntities) {

    this.service = service;
    this.remoteEntities = remoteEntities;
  }

  serviceFor(entityName) {
    return this.remoteEntities[entityName] || this.service;
  }

  /**
   * Expand "to one" associations with a single key field
   *
   * @param {*} req
   * @param {*} next
   * @param {*} associationName
   * @param {*} targetService
   * @param {*} headers
   * @returns
   */
  async mixinExpand(req, result, expand) {
    const associationName = expand.ref[0];

    // Get association target
    const [keyFieldName, targetKeyFieldName, targetEntityName, cardinalityMax] =
      associationLink(req.target, associationName);

    // Request all associated entities
    // REVISIT: Still needed?
    //const mock = !cds.env.requires.API_BUSINESS_PARTNER.credentials;
    //const tx = mock ? BupaService.tx(req) : BupaService;
    let ids = [];
    if (Array.isArray(result)) {
      ids = result.map((entry) => entry[keyFieldName]);
    } else {
      ids = [result[keyFieldName]];
    }

    // Take over columns from original query
    const expandColumns = expand.expand.map((entry) => entry.ref[0]);
    if (expandColumns.indexOf(targetKeyFieldName) < 0)
      expandColumns.push(targetKeyFieldName);

    const targetService = this.serviceFor(targetEntityName);

    // Select target
    const targetQuery = SELECT.from(targetEntityName)
      .where({ [targetKeyFieldName]: ids })
      .columns(expandColumns);
    const targetResult = await targetService.run(targetQuery);

    let targetResultMap;

    switch (cardinalityMax) {
      case '1':
        targetResultMap = this.mixinExpand_to_1(targetResult, targetKeyFieldName);
        break;
      case '*':
        targetResultMap = this.mixinExpand_to_many(targetResult, targetKeyFieldName);
        break;
      default:
        throw new Error(`Association with cardinality may ${cardinalityMax} is not supported.`);
    }

    const resultArray = Array.isArray(result) ? result : [ result ];
    for (const entry of resultArray) {
      const id = entry[keyFieldName];
      const targetEntry = targetResultMap[id];
      if (targetEntry) entry[associationName] = targetEntry;
    }
  }

  mixinExpand_to_1(targetResult, targetKeyFieldName) {
    const targetResultMap = {};
    for (const targetEntry of targetResult) {
      const id = targetEntry[targetKeyFieldName];
      targetResultMap[id] = targetEntry;
    }

    return targetResultMap;
  }

  mixinExpand_to_many(targetResult, targetKeyFieldName) {
    const targetResultMap = {};
    for (const targetEntry of targetResult) {
      const id = targetEntry[targetKeyFieldName];
      if (!targetResultMap[id]) targetResultMap[id] = [];
      targetResultMap[id].push(targetEntry);
    }

    return targetResultMap;
  }

  async resolveNavigation(req, next) {
    const select = req.query.SELECT;
    if (select.from.ref.length !== 2) {
      throw new Error(
        `Unsupported navigation query with different than 2 entities in FROM clause.`
      );
    }

    // Get target
    const entityName = select.from.ref[0].id;
    const entity = getEntity(entityName);

    const [keyFieldName, targetKeyFieldName, targetEntityName] =
      associationLink(entity, select.from.ref[1]);

    const sourceService = this.serviceFor(entityName);
    const targetService = this.serviceFor(targetEntityName);

    const selectOne = SELECT.one([keyFieldName])
      .from(entityName)
      .where(select.from.ref[0].where);
    const entry = await sourceService.run(selectOne);

    const selectTarget = SELECT(req.query.SELECT.columns)
      .from(targetEntityName)
      .where({ [targetKeyFieldName]: entry[keyFieldName] });
    return await targetService.run(selectTarget);
  }

  async handle(req, next) {
    let doRequest;

    if (
      req.query.SELECT.from.ref.length > 1 &&
      req.target.name !== req.query.SELECT.from.ref[0]
    ) {
      doRequest = () => this.resolveNavigation(req, next)
    } else {
        const targetService = this.serviceFor(req.target.name);
        doRequest = targetService === this.service ?
        next : () => targetService.run(req.query)
    }

    return this.resolveExpands(req, doRequest);
  }

  async resolveExpands(req, next) {
    const select = req.query.SELECT;
    const expandFilter = (column) => {
      if (!column.expand) return false;
      const associationName = column.ref[0];
      const associationTargetName =
        req.target.associations[associationName].target;
      return (
        this.remoteEntities[associationTargetName] !==
        this.remoteEntities[req.target.name]
      );
    };

    const expands = select.columns.filter(expandFilter);
    select.columns = select.columns.filter((column) => !expandFilter(column));

    if (expands.length === 0) return next();

    for (const expand of expands) {
      const associationName = expand.ref[0];
      const [keyFieldName] = associationLink(req.target, associationName);

      // Make sure id property is contained in select
      if (
        !select.columns.find((column) =>
          column.ref.find((ref) => ref == keyFieldName)
        )
      )
        select.columns.push({ ref: keyFieldName });
    }

    // Call service implementation
    const result = await next();

    await Promise.all(
      expands.map((expand) => this.mixinExpand(req, result, expand))
    );

    return result;
  }
}

RemoteHandler.columnNameFixes = {};
module.exports = RemoteHandler;
