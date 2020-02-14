package com.sap.teched.cap.bookstore.handlers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.sap.cds.ql.Select;
import com.sap.cds.ql.Update;
import com.sap.cds.ql.cqn.CqnSelect;
import com.sap.cds.ql.cqn.CqnUpdate;
import com.sap.cds.services.ErrorStatuses;
import com.sap.cds.services.ServiceException;
import com.sap.cds.services.cds.CdsService;
import com.sap.cds.services.handler.EventHandler;
import com.sap.cds.services.handler.annotations.After;
import com.sap.cds.services.handler.annotations.Before;
import com.sap.cds.services.handler.annotations.ServiceName;
import com.sap.cds.services.persistence.PersistenceService;

import cds.gen.ordersservice.OrderItems;
import cds.gen.ordersservice.Orders;
import cds.gen.sap.capire.bookstore.Books;
import cds.gen.sap.capire.bookstore.Books_;
import cds.gen.sap.capire.bookstore.OrderItems_;

@Component
@ServiceName("OrdersService")
public class OrdersService implements EventHandler {

    @Autowired
    PersistenceService db;

    @Before(event = CdsService.EVENT_CREATE, entity = "OrdersService.OrderItems")
    public void validateBookAndDecreaseStock(List<OrderItems> items) {
        for (OrderItems item : items) {
            String bookId = item.getBookId();
            Integer amount = item.getAmount();

            // check if the book that should be ordered is existing
            CqnSelect sel = Select.from(Books_.class).columns(b -> b.stock()).where(b -> b.ID().eq(bookId));
            Books book = db.run(sel).first(Books.class).orElseThrow(() -> new ServiceException(ErrorStatuses.NOT_FOUND, "Book does not exist"));

            // check if order could be fulfilled
            int stock = book.getStock();
            if (stock < amount) {
                throw new ServiceException(ErrorStatuses.BAD_REQUEST, "Not enough books on stock");
            }

            // update the book with the new stock, means minus the order amount
            book.setStock(stock - amount);
            CqnUpdate update = Update.entity(Books_.class).data(book).where(b -> b.ID().eq(bookId));
            db.run(update);
        }
    }

    @Before(event = CdsService.EVENT_CREATE, entity = "OrdersService.Orders")
    public void validateBookAndDecreaseStockViaOrders(List<Orders> orders) {
        for(Orders order : orders) {
            if(order.getItems() != null) {
                validateBookAndDecreaseStock(order.getItems());
            }
        }
    }

    @After(event = { CdsService.EVENT_READ, CdsService.EVENT_CREATE }, entity = "OrdersService.OrderItems")
    public void calculateNetAmount(List<OrderItems> items) {
        for (OrderItems item : items) {
            String bookId = item.getBookId();

            // get the book that was ordered
            CqnSelect sel = Select.from(Books_.class).where(b -> b.ID().eq(bookId));
            Books book = db.run(sel).single(Books.class);

            // calculate and set net amount
            item.setNetAmount(book.getPrice().multiply(new BigDecimal(item.getAmount())));
        }
    }

    @After(event = { CdsService.EVENT_READ, CdsService.EVENT_CREATE }, entity = "OrdersService.Orders")
    public void calculateTotal(List<Orders> orders) {
        for (Orders order : orders) {
            // calculate net amount for expanded items
            if(order.getItems() != null) {
                calculateNetAmount(order.getItems());
            }

            // get all items of the order
            CqnSelect selItems = Select.from(OrderItems_.class).where(i -> i.parent().ID().eq(order.getId()));
            List<OrderItems> allItems = db.run(selItems).listOf(OrderItems.class);

            // calculate net amount of all items
            calculateNetAmount(allItems);

            // calculate and set the orders total
            BigDecimal total = new BigDecimal(0);
            for(OrderItems item : allItems) {
                total = total.add(item.getNetAmount());
            }
            order.setTotal(total);
        }
    }
   
}
