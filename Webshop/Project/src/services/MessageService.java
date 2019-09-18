package services;

import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import beans.Advertisement;
import beans.Message;
import beans.User;
import dao.AdvertisementDAO;
import dao.MessageDAO;
import dao.UserDAO;

@Path("messages")
public class MessageService {
	
	@Context
	ServletContext ctx;
	
	public MessageService() {
		
	}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("messageDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("messageDAO", new MessageDAO(contextPath));
		}
	}
	
	@GET
	@Path("/getMessages")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Message> messages() {
		
		MessageDAO messageDao = (MessageDAO)ctx.getAttribute("messageDAO");
		return messageDao.findAll();
	}
	
	@POST
	@Path("/badAdWarning/{adId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response adminWarning(@PathParam("adId") UUID adId, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
		MessageDAO messageDao = (MessageDAO)ctx.getAttribute("messageDAO");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
			
		if(user == null) {
			return Response.status(400).build();
		}
		
		User admin = null;
		for(User u : userDao.getUsers().values()) {
			if(u.getRole() == 0)
				admin = u;
		}
		
		Advertisement ad = advertisementDAO.findAd(adId);
		
		Date d = new Date();
		long miliseconds = d.getTime();
		
		Message msg = new Message(ad.getName(), "Upozorenje", admin.getUsername(), ad.getPublisher(),
				"Dobili ste upozorenje zbog neodgovarajuceg/loseg oglasa!", miliseconds);
		
		userDao.getUsers().get(ad.getPublisher()).getSellerMessages().add(msg.getMsgId());
		messageDao.addMessages(msg, ctx.getRealPath(""));
		userDao.userChanged(userDao.getUsers(), ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/sendMessage")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addCategory(Message m, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");		
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<String, User> oldUsers = userDao.getUsers();
		System.out.println(m.getMsgReciver());
		oldUsers.get(m.getMsgReciver()).getSellerMessages().add(m.getMsgId()); //DODAJE SAMO PRIMAOCU
		
		userDao.userChanged(oldUsers, ctx.getRealPath(""));
		
		MessageDAO messageDao = (MessageDAO)ctx.getAttribute("messageDAO");
		messageDao.addMessages(m, ctx.getRealPath(""));
		
		return Response.status(200).build();
		
	}
	

	@POST
	@Path("/sellerDeletedAd/{idAd}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response sellerDeletedAd(@PathParam("idAd") String idAd, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
		MessageDAO messageDao = (MessageDAO)ctx.getAttribute("messageDAO");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		User admin = null;
		
		HashMap<String, User> allUsers = userDao.getUsers();
		for(User u : allUsers.values()) {
			if(u.getRole() == 0) {
				admin = u;
			}
		}
		
		Date d = new Date();
		long miliseconds = d.getTime();
		
		String adName = advertisementDAO.getAds().get(UUID.fromString(idAd)).getName();
		
		Message msg = new Message(adName, "Automatizovana poruka", "Webshop", 
				admin.getUsername(), "Prodavac " + user.getUsername() + "je obrisao oglas " + adName + " (" + advertisementDAO.getAds().get(UUID.fromString(idAd)).getIdAd() + ")",
				miliseconds);
		
		admin.getSellerMessages().add(msg.getMsgId());
		
		HashMap<String, User> oldUsers = userDao.getUsers();
		oldUsers.replace(admin.getUsername(), admin);
		
		userDao.userChanged(oldUsers, ctx.getRealPath(""));
		messageDao.addMessages(msg, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	
	@POST
	@Path("/changeMessage/{msgId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response changeCategory(@PathParam("msgId") String msgId, Message msg, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		MessageDAO messageDao = (MessageDAO)ctx.getAttribute("messageDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<UUID, Message> oldMessages = messageDao.getMessages();
		oldMessages.replace(msg.getMsgId(), msg);
		
		
		messageDao.msgChanged(oldMessages, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	
	@DELETE
	@Path("/deleteMessage/{msgId}")
	public Response deleteMessage(@PathParam("msgId") String msgId, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		//UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
		
		
		if(user == null) {
			return Response.status(400).build();
		}	
		
		MessageDAO messageDao = (MessageDAO)ctx.getAttribute("messageDAO");
		HashMap<UUID, Message> oldMessages = messageDao.getMessages();
		
		/*DA IZBRISE I PORUKU U USERS IZ SELLERMESSAGES
		String reciver = oldMessages.get(UUID.fromString(msgId)).getMsgReciver();
		HashMap<String, User> oldUsers = userDao.getUsers();
		ArrayList<UUID> messageUuids = oldUsers.get(reciver).getSellerMessages();
		
		for(int i = 0; i < messageUuids.size(); i++) {
			if(messageUuids.get(i).equals(UUID.fromString(msgId))) {
				System.out.println("USAO U IF");
				messageUuids.remove(i);
			}
		}
		
		
		oldUsers.get(reciver).setSellerMessages(messageUuids);
		userDao.userChanged(oldUsers, ctx.getRealPath(""));
		// KRAJ*/
	
		oldMessages.get(UUID.fromString(msgId)).setDeleted(true);
		messageDao.msgChanged(oldMessages, ctx.getRealPath(""));
		
		return Response.status(200).build();
		
	}
	
}
	