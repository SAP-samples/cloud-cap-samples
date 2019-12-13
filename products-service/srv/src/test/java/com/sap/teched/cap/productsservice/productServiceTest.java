package com.sap.teched.cap.productsservice;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class productServiceTest {

	private static final String ODATA_V4 = "/odata/v4";
	private static final String PRODUCTS_URI = ODATA_V4 + "/AdminService/Products";
	private static final String CATEGORIES_URI = ODATA_V4 + "/AdminService/Categories";
	private static final String CURRENCIES_URI = ODATA_V4 + "/AdminService/Currencies";

	@Autowired
	private MockMvc mockMvc;

	@Test
	public void testProducts() throws Exception {
		mockMvc.perform(get(PRODUCTS_URI).content("")).andExpect(status().isOk());
	}

	@Test
	public void testPostProducts() throws Exception {
		final String data = "{\"ID\": \"12345678-aaaa-bbbb-cccc-ddddeeeeffff\", \"title\": \"Awesome product\", \"descr\": \"It is really really awesome!\"}";

		mockMvc.perform(post(PRODUCTS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());
	}

	@Test
	public void testGetProduct() throws Exception {
		final String id = "12345611-aaaa-bbbb-cccc-ddddeeeeffef";
		final String data = "{\"ID\": \"12345611-aaaa-bbbb-cccc-ddddeeeeffef\", \"title\": \"Awesome book\", \"descr\": \"It is an awesome book!\"}";

		mockMvc.perform(post(PRODUCTS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());

		mockMvc.perform(get(PRODUCTS_URI + "(" + id + ")").content("")).andExpect(status().isOk())
				.andExpect(jsonPath("$.title", is("Awesome book")));
	}

	@Test
	public void testEditProduct() throws Exception {
		final String id = "12345678-aaaa-bbbb-dddd-ddddeeeeffef";
		final String data = "{\"ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\", \"title\": \"Awesome book\", \"descr\": \"It is an awesome book!\"}";
		final String changedData = "{\"ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\", \"title\": \"Awesome book\", \"descr\": \"It is a good book! I love it\"}";

		mockMvc.perform(post(PRODUCTS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());

		mockMvc.perform(put(PRODUCTS_URI + "(" + id + ")").contentType(APPLICATION_JSON_UTF8).content(changedData))
				.andExpect(status().isOk()).andExpect(jsonPath("$.modifiedAt", is(not(nullValue()))));
	}

	@Test
	public void testDeleteProduct() throws Exception {
		final String id = "12345678-aaaa-bbbb-cccc-ddddeeeeffdd";
		final String data = "{\"ID\": \"12345678-aaaa-bbbb-cccc-ddddeeeeffdd\", \"title\": \"Bad book\", \"descr\": \"It is a very bad book!\"}";

		mockMvc.perform(post(PRODUCTS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());

		mockMvc.perform(delete(PRODUCTS_URI + "(" + id + ")").content("")).andExpect(status().isNoContent());

		mockMvc.perform(get(PRODUCTS_URI + "(" + id + ")").content("")).andExpect(status().isNotFound());
	}

	@Test
	public void testGetProductWhenProductIDNotPresent() throws Exception {
		final String data = "{\"ID\": \"12345678-aaaa-bbbb-cccc-ddddeeeeffaa\", \"title\": \"Another book\", \"descr\": \"It is bad book!\"}";

		mockMvc.perform(post(PRODUCTS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());

		mockMvc.perform(get(PRODUCTS_URI + "(123)").content("")).andExpect(status().isBadRequest());
	}

	@Test
	public void testPostCategories() throws Exception {
		final String data = "{\"ID\": 2, \"parent_ID\": 1, \"name\": \"Fiction\"}";

		mockMvc.perform(post(CATEGORIES_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());
	}

	@Test
	public void testEditCategories() throws Exception {
		final String data = "{\"ID\": 3, \"parent_ID\": 1, \"name\": \"Fiction\"}";
		final String changedData = "{\"ID\": 3, \"name\": \"Science Fiction\"}";

		mockMvc.perform(post(CATEGORIES_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());

		mockMvc.perform(put(CATEGORIES_URI + "(3)").contentType(APPLICATION_JSON_UTF8).content(changedData))
				.andExpect(status().isOk());
	}

	@Test
	public void testPostCurrencies() throws Exception {
		final String data = "{\"code\": \"USD\", \"symbol\": \"$\", \"name\": \"US Dollar\", \"descr\": \"United States Dollar\"}";

		mockMvc.perform(post(CURRENCIES_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());
	}

}