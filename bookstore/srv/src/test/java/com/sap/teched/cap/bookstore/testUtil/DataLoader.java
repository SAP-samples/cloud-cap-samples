package com.sap.teched.cap.bookstore.testUtil;

import java.io.File;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import com.sap.cds.services.persistence.PersistenceService;
import com.sap.cds.services.runtime.CdsRuntime;

@Component
public class DataLoader implements ApplicationRunner {

	@Autowired
	private CdsRuntime runtime;

	public void run(ApplicationArguments args) {

		PersistenceService ds = (PersistenceService) runtime.getServiceCatalog()
				.getService(PersistenceService.DEFAULT_NAME);

		runtime.runInRequestContext(null, r -> {
			runtime.runInChangeSetContext(c -> {
				File folder = new File("../db/data");
				CsvUploader uploader = new CsvUploader(runtime.getCdsModel(), ds);
				for (File file : folder.listFiles()) {
					try {
						if(file.getName().equals("sap.capire.bookstore-Books_texts.csv"))
							continue;
						uploader.insertContent(file);
					} catch (RuntimeException | IOException e) {
						throw new RuntimeException("exception reading file " + file.getName(), e);
					}
				}

				return null;
			});

			return null;
		});
	}
}