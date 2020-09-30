const cds = require("@sap/cds");

const FIRST_INDEX = 0;
const SECOND_INDEX = 1;
const SKIP_CLI_ARGS_NUMBER = 2;
const THIRD_INDEX = 3;

const toValues = (object) => Object.values(object);

const camelCaseToSnake = (str) =>
  str.replace(
    /[a-z][A-Z]/g,
    (letters) =>
      `${letters[FIRST_INDEX].toLowerCase()}_${letters[
        SECOND_INDEX
      ].toLowerCase()}`
  );

const elementsToColumns = (elements) => {
  return Object.values(elements).map((element) =>
    element.target ? `${element.name}_ID` : element.name
  );
};

const constructInsertQuery = (targetEntityName, columns) => {
  return (data) => INSERT.into(targetEntityName).columns(columns).rows(data);
};

(async () => {
  const args = process.argv.slice(SKIP_CLI_ARGS_NUMBER);
  const SRC_STORAGE_NAME = args[FIRST_INDEX];
  const TARGET_STORAGE_NAME = args[SECOND_INDEX];
  const TARGET_SCHEMA_PATH = args[THIRD_INDEX];
  console.log(
    "[LOG]: Import data from",
    SRC_STORAGE_NAME,
    "to",
    TARGET_STORAGE_NAME
  );

  try {
    const srcStorage = await cds.connect.to(SRC_STORAGE_NAME);
    const targetStorage = await cds.connect.to(TARGET_STORAGE_NAME);

    const eList = targetStorage.entities;

    const targetCSNModel = await cds.load(TARGET_SCHEMA_PATH);
    const reflectedCSNModel = cds.reflect(targetCSNModel);
    const targetCSNEntities = Object.values(reflectedCSNModel.entities);

    for (index in targetCSNEntities) {
      const { name: targetEntityName, elements } = targetCSNEntities[index];
      const targetColumns = elementsToColumns(elements);
      const insertQuery = constructInsertQuery(targetEntityName, targetColumns);

      const srcEntityName = camelCaseToSnake(targetEntityName.split(".").pop());
      const srcResultRows = (await srcStorage.read(srcEntityName)).map(
        toValues
      );

      console.log("[LOG]: From", srcEntityName, "to", targetEntityName);

      const transaction = await targetStorage.tx();
      await transaction.run(srcResultRows.map(insertQuery));
      await transaction.commit();
    }
  } catch (errors) {
    console.error(errors);
  }
})();
