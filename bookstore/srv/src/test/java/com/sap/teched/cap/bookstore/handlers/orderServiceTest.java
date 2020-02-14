package com.sap.teched.cap.bookstore.handlers;

import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.CoreMatchers.not;
import static org.hamcrest.CoreMatchers.nullValue;
import static org.springframework.http.MediaType.APPLICATION_JSON_UTF8;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import cds.gen.sap.capire.bookstore.OrderItems;

@RunWith(SpringRunner.class)
@SpringBootTest
@AutoConfigureMockMvc
public class orderServiceTest {

	private static final String ODATA_V4 = "/odata/v4";
	private static final String BOOKS_URI = ODATA_V4 + "/BooksService/Books";
	private static final String ORDERS_URI = ODATA_V4 + "/OrdersService/Orders";
	private static final String ORDER_ITEMS_URI = ODATA_V4 + "/OrdersService/OrderItems";

	@Autowired
	private MockMvc mockMvc;

	@Test
	public void testGetBooks() throws Exception {

		mockMvc.perform(get(BOOKS_URI).content("")).andExpect(status().isOk())
				.andExpect(jsonPath("$.value[0].title", is("Wuthering Heights")));
	}

	@Test
	public void testCreateOrderItem() throws Exception {

		final String data = "{\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\",\"book_ID\": \"abed2f7a-c50e-4bc5-89fd-9a00a54b4b16\", \"amount\": 1 }";

		mockMvc.perform(post(ORDER_ITEMS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());

		mockMvc.perform(get(ORDER_ITEMS_URI).content("")).andExpect(status().isOk())
				.andExpect(jsonPath("$.value[0].parent_ID", is("12345678-aaaa-bbbb-dddd-ddddeeeeffef")));
	}

	@Test
	public void tesValidateBookAndDecreaseStock() throws Exception {

		final String data = "{\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffee\",\"book_ID\": \"5e69a718-d86b-4461-8953-0edadcd87960\", \"amount\": 20 }";

		mockMvc.perform(post(ORDER_ITEMS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isCreated());

		mockMvc.perform(post(ORDER_ITEMS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andExpect(status().isBadRequest());

	}

	@Test
	public void tesCalculateNetAmount() throws Exception {

		final String data = "{\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffbb\",\"book_ID\": \"b7bca6dd-0497-465e-9a5a-56f244174c8c\", \"amount\": 10 }";

		MvcResult result = mockMvc.perform(post(ORDER_ITEMS_URI).contentType(APPLICATION_JSON_UTF8).content(data))
				.andReturn();

		JSONObject jsonObj = new JSONObject(result.getResponse().getContentAsString());

		String id = jsonObj.get("ID").toString();
		
		mockMvc.perform(get(ORDER_ITEMS_URI+ "(" + id + ")").content("")).andExpect(status().isOk())
				.andExpect(jsonPath("$.netAmount", is(141.4)));

	}
	
	
	@Test
	public void testCreateOrder() throws Exception {
		
		final String orderData = "{\r\n" + 
				"	\"items\": [{\r\n" + 
				"		\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\",\r\n" + 
				"		\"book_ID\": \"abed2f7a-c50e-4bc5-89fd-9a00a54b4b16\",\r\n" + 
				"		\"amount\": 1\r\n" + 
				"	}, {\r\n" + 
				"		\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\",\r\n" + 
				"		\"book_ID\": \"b7bca6dd-0497-465e-9a5a-56f244174c8c\",\r\n" + 
				"		\"amount\": 1\r\n" + 
				"	}]\r\n" + 
				"}";
		
		
		mockMvc.perform(post(ORDERS_URI).contentType(APPLICATION_JSON_UTF8).content(
				  orderData)) .andExpect(status().isCreated());
		 
	}
	
	@Test
	public void testCalculateTotal() throws Exception {
		
		final String orderData = "{\r\n" + 
				"	\"items\": [{\r\n" + 
				"		\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\",\r\n" + 
				"		\"book_ID\": \"abed2f7a-c50e-4bc5-89fd-9a00a54b4b16\",\r\n" + 
				"		\"amount\": 1\r\n" + 
				"	}, {\r\n" + 
				"		\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\",\r\n" + 
				"		\"book_ID\": \"b7bca6dd-0497-465e-9a5a-56f244174c8c\",\r\n" + 
				"		\"amount\": 2\r\n" + 
				"	}]\r\n" + 
				"}";
		
		MvcResult result = mockMvc.perform(post(ORDERS_URI).contentType(APPLICATION_JSON_UTF8).content(orderData))
				.andReturn();

		JSONObject jsonObj = new JSONObject(result.getResponse().getContentAsString());

		String id = jsonObj.get("ID").toString();
		
		mockMvc.perform(get(ORDERS_URI+ "(" + id + ")").content("")).andExpect(status().isOk())
		.andExpect(jsonPath("$.total", is(39.39)));
		 
	}
	
	@Test
	public void testValidateBookAndDecreaseStockViaOrders() throws Exception {
		
		final String orderData = "{\r\n" + 
				"	\"items\": [{\r\n" + 
				"		\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\",\r\n" + 
				"		\"book_ID\": \"fd0c5fda-8811-4e20-bcff-3a776abc290a\",\r\n" + 
				"		\"amount\": 300\r\n" + 
				"	}, {\r\n" + 
				"		\"parent_ID\": \"12345678-aaaa-bbbb-dddd-ddddeeeeffef\",\r\n" + 
				"		\"book_ID\": \"b7bca6dd-0497-465e-9a5a-56f244174c8c\",\r\n" + 
				"		\"amount\": 1\r\n" + 
				"	}]\r\n" + 
				"}";
		mockMvc.perform(post(ORDERS_URI).contentType(APPLICATION_JSON_UTF8).content(orderData))
		.andExpect(status().isCreated());
		
		mockMvc.perform(post(ORDERS_URI).contentType(APPLICATION_JSON_UTF8).content(orderData))
		.andExpect(status().isBadRequest());
	 
	}


}