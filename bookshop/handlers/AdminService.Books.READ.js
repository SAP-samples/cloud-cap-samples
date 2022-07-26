const result_ = Array.isArray(result) ? result : [result];
for (const row of result_) {
  if (row.stock > 50) {
    row.title += " ---Order now for a 10% discount!";
  }
}
