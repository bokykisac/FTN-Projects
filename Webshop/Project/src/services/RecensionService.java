package services;

import java.util.Collection;
import java.util.Date;
import java.util.UUID;

import javax.annotation.PostConstruct;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
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
import beans.Recension;
import beans.User;
import dao.AdvertisementDAO;
import dao.MessageDAO;
import dao.RecensionDAO;
import dao.UserDAO;

@Path("/recensions")
public class RecensionService {
	
	@Context
	ServletContext ctx;
	
	public RecensionService() {
		
	}
	
	@PostConstruct
	public void init() {
		
		if(ctx.getAttribute("RecensionDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("RecensionDAO", new RecensionDAO(contextPath));
		}
	}
	
	@GET
	@Path("/getRecensions")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Recension> getAllRecensions(){
		
		RecensionDAO recensionDAO = (RecensionDAO)ctx.getAttribute("RecensionDAO");
		return recensionDAO.findAll();
	}
	
	@GET
	@Path("/deleteRecension/{recId}")
	public Response removeRecension(@PathParam("recId") String recId, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		RecensionDAO recensionDAO = (RecensionDAO)ctx.getAttribute("RecensionDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		recensionDAO.getRecensions().get(UUID.fromString(recId)).setActive(false);
		
		
		recensionDAO.recensionChanged(recensionDAO.getRecensions(), ctx.getRealPath(""));
		
		return Response.status(200).build();
		
	}
	
	@POST
	@Path("/changeRecension")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response changeRecension(Recension r, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		RecensionDAO recensionDAO = (RecensionDAO)ctx.getAttribute("RecensionDAO");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		MessageDAO messageDAO = (MessageDAO)ctx.getAttribute("messageDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		recensionDAO.getRecensions().replace(r.getRecensionId(), r);
		
		Advertisement ad = advertisementDAO.findAd(r.getAdId());
		
		Date d = new Date();
		long miliseconds = d.getTime();
		
		Message msg = new Message(ad.getName(), "Automatizovana poruka", "Webshop",
				userDAO.getUsers().get(ad.getPublisher()).getUsername(), "Kupac " + user.getUsername() + " je izmenio recenziju za vas oglas!", miliseconds);
		
		userDAO.getUsers().get(ad.getPublisher()).getSellerMessages().add(msg.getMsgId());
		
		recensionDAO.recensionChanged(recensionDAO.getRecensions(), ctx.getRealPath(""));
		
		advertisementDAO.adChanged(advertisementDAO.getAds(), ctx.getRealPath(""));
		userDAO.userChanged(userDAO.getUsers(), ctx.getRealPath(""));
		messageDAO.addMessages(msg, ctx.getRealPath(""));
		recensionDAO.addRecension(r, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/addRecension")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addRecension(Recension r, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		RecensionDAO recensionDAO = (RecensionDAO)ctx.getAttribute("RecensionDAO");
		MessageDAO messageDAO = (MessageDAO)ctx.getAttribute("messageDAO");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		Advertisement ad = advertisementDAO.findAd(r.getAdId());
		ad.getRecensions().add(r.getRecensionId());
		advertisementDAO.getAds().replace(ad.getIdAd(), ad);
		
		Date d = new Date();
		long miliseconds = d.getTime();
		
		Message msg = new Message(ad.getName(), "Automatizovana poruka", "Webshop",
				userDAO.getUsers().get(ad.getPublisher()).getUsername(), "Dobili ste recenziju na vas oglas!", miliseconds);
		
		
		userDAO.getUsers().get(ad.getPublisher()).getSellerMessages().add(msg.getMsgId());
		
		advertisementDAO.adChanged(advertisementDAO.getAds(), ctx.getRealPath(""));
		userDAO.userChanged(userDAO.getUsers(), ctx.getRealPath(""));
		messageDAO.addMessages(msg, ctx.getRealPath(""));
		recensionDAO.addRecension(r, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}

}
