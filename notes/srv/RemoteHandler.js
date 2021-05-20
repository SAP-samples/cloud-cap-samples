function fixColumnName(entity, name) {
  const fullName = `${entity.name}.${name}`;
  return RemoteHandler.columnNameFixes[fullName] || name;
}

/**
 *
 * @param {string} msg
 * @returns {never}
 */
function throwError(msg) {
  throw new Error(msg);
}

/**
 * @param {{name: string}|string} entity
 * @param {{name: string}|string} association
 * @param {string} msg
 * @returns {never}
 */
function throwAssocError(entity, association, msg) {
  throw new Error(`Error with association "${association.name || association}" of entity "${entity.name || entity}": ${msg}`);
}

function getEntity(absoluteName) {
  const [serviceName, entityName] = absoluteName.split(".");
  return cds.services[serviceName]?.entities[entityName] || throwError(`Unknown entity "${absoluteName}"`);
}


class RemoteHandler {
  constructor(service, remoteEntities) {

    this.service = service;
    this.remoteEntities = remoteEntities;
  }

  serviceFor(entityName) {
    return this.remoteEntities[entityName] || cds.db;
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
    const {keyFieldName, targetKeyFieldName, target, is2many, is2one} =
      this.association(req.target, associationName);

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

    const targetService = this.serviceFor(target.name);

    // Select target
    // REVISIT: const targetResult = await targetService.read(target.name).where({ [targetKeyFieldName]: ids }).columns(expandColumns);
    const targetQuery = SELECT.from(target.name)
      .where({ [targetKeyFieldName]: ids })
      .columns(expandColumns);
    const targetResult = await targetService.run(targetQuery);

    let targetResultMap;

    if (is2one) {
        targetResultMap = this.mixinExpand_to_1(targetResult, targetKeyFieldName);
    } else if (is2many) {
        targetResultMap = this.mixinExpand_to_many(targetResult, targetKeyFieldName);
    } else {
      throwAssocError(req.target, associationName, `Unsupported cardinality.`);
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

  /**
   * @example
   * Notes(24B58115-E394-423B-BEAB-53419A32B927)/supplier
   *
   * -->
   * { SELECT: { from: { ref: {[
   *   [ id: 'NotesService.Notes',
   *     where: [
   *       ref: [ 'ID' ],
   *       '=',
   *       val: ''545A3CF9-84CF-46C8-93DC-E29F0F2BC6BE'
   *      ],
   *   ],
   *   [ 'supplier' ]
   * ]}}}
   *
   *
   * @param {*} req
   * @param {*} next
   * @returns
   */
  async resolveNavigation(req, next) {
    const select = req.query.SELECT;
    if (select.from.ref.length !== 2) {
      throw new Error(
        `Unsupported navigation query with different than 2 entities in FROM clause.`
      );
    }

    const entityName = select.from.ref[0].id || throwError(`Missing source entity name for navigation`);
    const entity = getEntity(entityName);
    const associationName = select.from.ref[1] || throwError(`Missing association name for navigation`);

    const {keyFieldName, targetKeyFieldName, target, is2many, is2one} = this.association(entity, associationName);

    const sourceService = this.serviceFor(entityName);
    const targetService = this.serviceFor(target.name);

    if (sourceService === targetService) return await next();

    // REVISIT: How to call service datasource w/o handlers
    const selectEntry = SELECT.one([keyFieldName])
      .from(entityName)
      .where(select.from.ref[0].where);
    const entry = await sourceService.run(selectEntry);

    // REVISIT: How to call service datasource w/o handlers
    // REVISIT: const result = await targetService.read(target).columns(req.query.SELECT.columns).where({ [targetKeyFieldName]: entry[keyFieldName] });
    const selectTarget = SELECT(req.query.SELECT.columns)
      .from(target)
      .where({ [targetKeyFieldName]: entry[keyFieldName] });
    const result = await targetService.run(selectTarget);
    if (is2many) {
      return result;
    } else if (is2one) {
      return result?.[0];
    } else {
      throw new Error('Unsupported association cardinality');
    }
}

  async handle(req, next) {
    let doRequest;

    if (
      req.query.SELECT.from.ref.length > 1 &&
      req.target.name !== req.query.SELECT.from.ref[0]
    ) {
      doRequest = () => this.resolveNavigation(req, next)
    } else {
        doRequest = this.isRemote(req.target.name) ?
          () => this.serviceFor(req.target.name).run(req.query) : next;
    }

    return this.resolveExpands(req, doRequest);
  }

  isRemote(entityName) {
    return this.serviceFor(entityName) !== cds.db;
  }

  isSeparated(entityNameA, entityNameB) {
    return this.serviceFor(entityNameA) !== this.serviceFor(entityNameB);
  }

  async resolveExpands(req, next) {
    const select = req.query.SELECT;
    const expandFilter = (column) => {
      if (!column.expand) return false;
      const associationName = column.ref[0];

      return this.isSeparated(req.target.name, req.target.associations[associationName].target);
    };

    const expands = select.columns.filter(expandFilter);
    select.columns = select.columns.filter((column) => !expandFilter(column));

    if (expands.length === 0) return next();

    const temporaryKeyFieldNames = [];
    for (const expand of expands) {
      const associationName = expand.ref[0];
      const {keyFieldName} = this.association(req.target, associationName);

      // Make sure id property is contained in select
      if (
        !select.columns.find((column) =>
          column.ref.find((ref) => ref == keyFieldName)
        )
      ) {
        select.columns.push({ ref: keyFieldName });
        temporaryKeyFieldNames.push(keyFieldName);
      }
    }

    // Call service implementation
    const result = await next();

    await Promise.all(
      expands.map((expand) => this.mixinExpand(req, result, expand))
    );

    if (temporaryKeyFieldNames.length > 0) {
      for (const entry of result) {
        for (const name of temporaryKeyFieldNames)
          delete entry[name];
      }
    }

    return result;
  }

  association(entity, associationName, recursion = 0) {
    let associationMetaData;

    if (++recursion > 2) throwAssocError(entity, association, "Association has recursive definition.");

    const association = entity.associations[associationName] || throwAssocError(entity, associationName, `Association does not exists`);

    associationMetaData = this.associationKey(entity, association);
    if (!associationMetaData) {
        associationMetaData = this.associationOn(entity, association);
    }
    if (!associationMetaData) {
      associationMetaData = this.associationOnSelf(entity, association, recursion);
    }

    if (!association) throwAssocError(entity, association, "Only associations with one key field or on conidition with one field are supported.");

    associationMetaData.is2many = association.is2many;
    associationMetaData.is2one  = association.is2one;
    associationMetaData.entity  = entity;
    associationMetaData.target  = getEntity(association.target);
    return associationMetaData;
  }

  /**
   * Association with "on" condition
   *
   * @example
   * entity Notes {
   *   supplier_ID : Suppliers:ID;
   *   supplier: Association to Suppliers on supplier.ID = supplier_ID;
   * }
   *
   * -->
   *
   * { association: { on: { [
   *   ref: [ 'supplier', 'ID' ], // <association>.<target-field>
   *   '=',
   *   ref: [ 'supplier_ID' ] // <source-field>
   * ] }}}
   *
   * @param {*} entity
   * @param {*} association
   * @returns
   */
  associationOn(entity, association) {
    const onLength = association.on?.length ?? 0;
    if (onLength === 0) return;

    const on = association.on;
    if (!(onLength === 3 && on[0]?.ref?.[0] === association.name && on[1] === "=" && on[2]?.ref[0] !== "$self")) return; //throwAssocError(entity, association, "Association on condition must compare to $self");

    return {
      keyFieldName: fixColumnName(entity, association.on[2].ref[0]),
      targetKeyFieldName: association.on[0].ref.slice(1).join("_")
    }
  }

  /**
   *
   * @example
   * extend entity BusinessPartner {
   *   notes: Composition of many Notes on notes = $self;
   * }
   *
   * @param {*} entity
   * @param {*} association
   * @returns
   */

  associationOnSelf(entity, association, recursion) {
    const onLength = association.on?.length ?? 0;
    if (onLength === 0) return;

    const on = association.on;
    if (!(onLength === 3 && on[0]?.ref && on[1] === "=" && on[2]?.ref[0] === "$self")) return; //throwAssocError(entity, association, "Association on condition must compare to $self");

    const reverseAssociationName = association.on[0].ref[1];
    const reverseAssociationMetaData = this.association(targetEntity, reverseAssociationName, false);

    return {
      keyFieldName: reverseAssociationMetaData.targetKeyFieldName,
      targetKeyFieldName: reverseAssociationMetaData.keyFieldName
    }
  }

  /**
   * Association with keys
   *
   * @example
   * entity Notes {
   *   supplier: Association to Suppliers;
   * }
   *
   * -->
   *
   * { association: keys: [ {
   *     $generatedFieldName: 'supplier_ID',
   *     ref: [ 'ID' ]
   *   } ]
   * }
   *
   * @param {*} entity
   * @param {*} association
   * @returns
   */
  associationKey(entity, association) {
    const keyLength = association.keys?.length ?? 0;
    if (keyLength === 0) return;
    if (keyLength > 1) throwAssocError(entity, association, `Association has ${keyLength} key fields, but only 1 is supported.`);
    const key = association.keys[0];

    return {
      keyFieldName: key["$generatedFieldName"] || throwError(entity, association, "Missing $generatedFieldName"),
      targetKeyFieldName: key.ref[0] || throwError(entity, association, "Missing key ref")
    }
  }

}

RemoteHandler.columnNameFixes = {};
module.exports = RemoteHandler;
