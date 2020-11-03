const cds = require("@sap/cds");

const FIRST_INDEX = 0;
const ZERO_VALUE = 0;
const SECOND_INDEX = 1;
const ID_IF_NOT_FOUND = "ID";

const SRC_STORAGE_NAME = "sqlite:chinook.db";

const camelCaseToSnake = (str) =>
  str.replace(
    /[a-z][A-Z]/g,
    (letters) =>
      `${letters[FIRST_INDEX].toLowerCase()}_${letters[
        SECOND_INDEX
      ].toLowerCase()}`
  );

const omitID = (str) => {
  return str.replace(/_ID$/g, "");
};

const omitId = (str) => {
  return str.replace(/Id$/g, "");
};

const chooseFromTargetColumns = (targetColumns) => {
  return (srcColumn) => {
    const result = targetColumns.find((targetColumn) => {
      const one = omitId(srcColumn).toUpperCase();
      const two = omitID(targetColumn).toUpperCase();
      if (one === two) {
        return true;
      }
      return false;
    });
    return result ? result : ID_IF_NOT_FOUND;
  };
};

const reorderTargetColumns = (srcColumns, targetColumns) => {
  const mapColumn = chooseFromTargetColumns(targetColumns);
  return srcColumns.map(mapColumn);
};

const elementsToColumns = (elements) => {
  return Object.values(elements).map((element) =>
    element.target ? `${element.name}_ID` : element.name
  );
};

const constructInsertQuery = (targetEntityName) => {
  return (row, columns) =>
    INSERT.into(targetEntityName).columns(columns).rows(row);
};

/**
 * The MAIN ISSUE such import is that it depends on:
 * - snake case table names
 * - camel case column names
 * of chinook.db
 * There is 'Launch import' task in .vscode folder for debugging.
 */
async function importData(targetDb) {
  try {
    const srcStorage = await cds.connect.to(SRC_STORAGE_NAME);
    const targetCSNEntities = Object.values(targetDb.entities);
    const targetCSNEntitiesNames = Object.keys(targetDb.entities);

    const someEntry = await targetDb.run(
      SELECT.one(targetCSNEntitiesNames[FIRST_INDEX])
    );
    if (!!someEntry) {
      return;
    }

    for (index in targetCSNEntities) {
      const targetEntityName = targetCSNEntitiesNames[index];
      console.log(`[LOG]:  Processing ${targetEntityName}`);

      const { elements } = targetCSNEntities[index];
      const targetColumns = elementsToColumns(elements); // e.g. ['ID', ..., 'total', 'customer_ID']
      const srcEntityName = camelCaseToSnake(targetEntityName);
      const insertQuery = constructInsertQuery(targetEntityName);
      let srcResultRows;
      try {
        srcResultRows = await srcStorage.run(`
          SELECT * from ${srcEntityName} 
        `); // e.g. [ { AlbumId:1, ArtistId:1, Title:'some' }, ... ]
      } catch (e) {
        console.log("[ERROR]: while trying to read source table", e.message);
        continue;
      }
      if (!srcResultRows || srcResultRows.length < ZERO_VALUE) {
        console.log(
          `[LOG] Skipping ${targetEntityName}.
          There is no data provided in ${SRC_STORAGE_NAME}, ${srcEntityName}`
        );
        continue;
      }
      const srcColumns = Object.keys(srcResultRows[FIRST_INDEX]);
      const columns = reorderTargetColumns(srcColumns, targetColumns);
      if (new Set(columns).size !== columns.length) {
        throw new Error(
          `Some ${targetEntityName} column name is mismatched in ${SRC_STORAGE_NAME} ${srcEntityName}`
        );
      }
      // for mock auth
      if (srcEntityName === "Employees" || srcEntityName === "Customers") {
        columns.push("password");
        srcResultRows = srcResultRows.map((row) => ({
          ...row,
          password: "some",
        }));
      }

      const transaction = await targetDb.tx();
      await transaction.run(
        srcResultRows.map((row) => insertQuery(Object.values(row), columns))
      );
      await transaction.commit();
    }
    console.log("[LOG]: ", "Import completed");
  } catch (errors) {
    console.error(errors);
  }
}

module.exports = { importData };
