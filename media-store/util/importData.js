const cds = require("@sap/cds");

const FIRST_INDEX = 0;
const ZERO_VALUE = 0;
const SECOND_INDEX = 1;
const SKIP_CLI_ARGS_NUMBER = 2;
const THIRD_INDEX = 2;
const ID_IF_NOT_FOUND = "ID";

const args = process.argv.slice(SKIP_CLI_ARGS_NUMBER);
const SRC_STORAGE_NAME = args[FIRST_INDEX];
const TARGET_STORAGE_NAME = args[SECOND_INDEX];
const TARGET_SCHEMA_PATH = args[THIRD_INDEX];

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

const logProcessArgs = () => {
  console.log(
    `[LOG]: Import data from ${SRC_STORAGE_NAME} to ${TARGET_STORAGE_NAME}, schema path: ${TARGET_SCHEMA_PATH}`
  );
};

/**
 * The MAIN ISSUE such import is that it depends on:
 * - snake case table names
 * - camel case column names
 * of chinook.db
 * There is 'Launch import' task in .vscode folder for debugging.
 */
(async () => {
  logProcessArgs();
  try {
    const srcStorage = await cds.connect.to(SRC_STORAGE_NAME);
    const targetStorage = await cds.connect.to(TARGET_STORAGE_NAME);
    const targetCSNModel = await cds.load(TARGET_SCHEMA_PATH);

    const reflectedCSNModel = cds.reflect(targetCSNModel);
    const targetCSNEntities = Object.values(reflectedCSNModel.entities);

    for (index in targetCSNEntities) {
      const { name: targetEntityName, elements } = targetCSNEntities[index];
      console.log(`[LOG]:  Processing ${targetEntityName}`);
      const targetColumns = elementsToColumns(elements); // e.g. ['ID', ..., 'total', 'customer_ID']
      const insertQuery = constructInsertQuery(targetEntityName, targetColumns);

      const srcEntityName = camelCaseToSnake(targetEntityName.split(".").pop());
      const srcResultRows = await srcStorage.read(srcEntityName); // e.g. [ { AlbumId:1, ArtistId:1, Title:'some' }, ... ]
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

      const transaction = await targetStorage.tx();
      await transaction.run(
        srcResultRows.map((row) => insertQuery(Object.values(row), columns))
      );
      await transaction.commit();
    }
  } catch (errors) {
    console.error(errors);
  }
})();
