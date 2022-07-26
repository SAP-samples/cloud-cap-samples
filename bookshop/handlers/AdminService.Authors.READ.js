const result_ = Array.isArray(result) ? result : [result]
for (const row of result_) {
  row.modifiedBy += " --- read in sandbox"
  row.age = 27
}
