package com.sap.teched.cap.bookstore.testUtil;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sap.cds.ql.Insert;
import com.sap.cds.reflect.CdsElement;
import com.sap.cds.reflect.CdsEntity;
import com.sap.cds.reflect.CdsModel;
import com.sap.cds.reflect.CdsSimpleType;
import com.sap.cds.services.persistence.PersistenceService;

public class CsvUploader {

	private final CdsModel model;
	private final PersistenceService ds;

	public CsvUploader(CdsModel model, PersistenceService ds) {
		this.model = model;
		this.ds = ds;
	}

	void insertContent(File file) throws FileNotFoundException, IOException {
		String fileName = file.getName();
		String entityName = fileName.replace("-", ".").substring(0, fileName.length() - 4);
		CdsEntity entity = model.getEntity(entityName);
		List<Map<String, Object>> data = new ArrayList<>();

		try (BufferedReader br = new BufferedReader(new FileReader(file))) {
			String line = br.readLine();
			CdsElement[] headers = getHeaders(entity, line);
			while ((line = br.readLine()) != null) {
				Map<String, Object> row = new HashMap<>();
				String[] values = line.split(";");
				for (int i = 0; i < headers.length; i++) {
					CdsElement element = headers[i];
					String typeName = element.getType().as(CdsSimpleType.class).getQualifiedName();
					final Object value;
					String txt = values[i];
					if ("".equals(txt)) {
						continue;
					}
					switch (typeName) {
					case "cds.Integer":
						value = Integer.valueOf(txt);
						break;
					case "cds.Date":
						value = LocalDate.parse(txt);
						break;
					default:
						value = txt;
					}
					row.put(element.getName(), value);
				}

				data.add(row);
			}
		}

		Insert insert = Insert.into(entity).entries(data);
		ds.run(insert);
	}

	private CdsElement[] getHeaders(CdsEntity entity, String line) {
		String[] elementNames = line.split(";");
		CdsElement[] result = new CdsElement[elementNames.length];
		for (int i = 0; i < elementNames.length; i++) {
			result[i] = entity.getElement(elementNames[i]);
		}

		return result;
	}

}
