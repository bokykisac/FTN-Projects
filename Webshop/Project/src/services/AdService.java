package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
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
import beans.User;
import dao.AdvertisementDAO;
import dao.MessageDAO;
import dao.UserDAO;

@Path("/ads")
public class AdService {
	
	@Context
	ServletContext ctx;
	
	public AdService() {
		
	}
	
	@PostConstruct
	public void init() {

		if (ctx.getAttribute("AdvertisementDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("AdvertisementDAO", new AdvertisementDAO(contextPath));
		}
	}
	
	@GET
	@Path("/getAds")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Advertisement> ads() {
		
		AdvertisementDAO adsDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		return adsDAO.findAll();
	}
	

	@POST
	@Path("/addNewAd")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addAd(Advertisement ad, @Context HttpServletRequest request) {
				
		User user = (User)request.getSession().getAttribute("user");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		user.getSellerPostedAds().add(ad.getIdAd());
		
		HashMap<String, User> oldUsers = userDAO.getUsers();
		oldUsers.replace(user.getUsername(), user);
		
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		
		advertisementDAO.AddAd(ad, ctx.getRealPath(""));
		
		return Response.status(200).build();
		
	}
	
	@POST
	@Path("/changeAd/{adId}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response changeAdvertisement(@PathParam("adId") String adId, Advertisement ad, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		MessageDAO messageDAO = (MessageDAO)ctx.getAttribute("messageDAO");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		HashMap<String, User> oldUsers = userDAO.getUsers();
		HashMap<UUID,Message> oldMessages = messageDAO.getMessages();
		
		Date d = new Date();
		long miliseconds = d.getTime();
		
		if(user.getRole() == 0) {
			
			oldAds.replace(UUID.fromString(adId), ad);
			
			Message m = new Message(ad.getName(), "Automatizovana poruka", "Webshop",
					ad.getPublisher(), "Admin je izmenio vas oglas!", miliseconds);
			
			oldUsers.get(ad.getPublisher()).getSellerMessages().add(m.getMsgId());
			oldMessages.put(m.getMsgId(), m);
			
			
			if(ad.getStatus() == 0) { //u realizaciji
				for(User u : oldUsers.values()) {
					
					if(u.getRole() != 1)
						continue;
					
					for(int i = 0; i < u.getBuyerOrderedAds().size(); i++) {
						if(ad.getIdAd().equals(u.getBuyerOrderedAds().get(i))) {
							
							Message mkupacOrd = new Message(ad.getName(), "Automatizovana poruka", "Webshop",
									u.getUsername(), "Admin je izmenio vas oglas koji je u realizaciji!", miliseconds);
			
							oldUsers.get(u.getUsername()).getSellerMessages().add(mkupacOrd.getMsgId());
							oldMessages.put(mkupacOrd.getMsgId(), mkupacOrd);
	
						}
					}
				}	
			}else if(ad.getStatus() == 1) { //u delivered
				for(User u : oldUsers.values()) {
					if(u.getRole() != 1)
						continue;
					
					for(int i = 0; i < u.getBuyerDeliveredAds().size(); i++) {
						if(ad.getIdAd().equals(u.getBuyerDeliveredAds().get(i))) {
							
							Message mkupacDel = new Message(ad.getName(), "Automatizovana poruka", "Webshop",
									u.getUsername(), "Admin je izmenio vas oglas koji je dostavljen!", miliseconds);
							
							oldUsers.get(u.getUsername()).getSellerMessages().add(mkupacDel.getMsgId());
							oldMessages.put(mkupacDel.getMsgId(), mkupacDel);
														
						}
					}
				}
			}		
		}else if(user.getRole() == 2){
			
			oldAds.replace(UUID.fromString(adId), ad);	
			
		}
		
		messageDAO.msgChanged(oldMessages, ctx.getRealPath(""));
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	
	
	@GET
	@Path("/removeAd/{idAd}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeAd(@PathParam("idAd") String idAd, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		MessageDAO messageDao = (MessageDAO)ctx.getAttribute("messageDAO");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		oldAds.get(UUID.fromString(idAd)).setActive(false);
		HashMap<String, User> oldUsers = userDAO.getUsers();
		
		if(user.getRole() == 0) {
			
			Date d = new Date();
			long miliseconds = d.getTime();
			
			Advertisement ad = advertisementDAO.getAds().get(UUID.fromString(idAd));
			Message msgProdavac = new Message(ad.getName(), "Automatizovana poruka", "Webshop", ad.getPublisher(),
					"Admin " + user.getUsername() + " je obrisao vas oglas!", miliseconds);
			
			messageDao.addMessages(msgProdavac, ctx.getRealPath(""));
			oldUsers.get(ad.getPublisher()).getSellerMessages().add(msgProdavac.getMsgId());
			
			if(ad.getStatus() == 0) {		//proizvod u realizaciji			
				for(User u : userDAO.getUsers().values()) {
					
					if(u.getRole() == 0 || u.getRole() == 2)
						continue;
					
					for(int i = 0; i < u.getBuyerOrderedAds().size(); i++) {
						if(u.getBuyerOrderedAds().get(i).equals(ad.getIdAd())) {
							Message msgKupacRel = new Message(ad.getName(), "Automatizovana poruka", "Webshop", u.getUsername(),
									"Admin " + user.getUsername() + " je obrisao vas oglas koji je bio u realizaciji!", miliseconds);
							messageDao.addMessages(msgKupacRel, ctx.getRealPath(""));
							
							oldUsers.get(u.getUsername()).getSellerMessages().add(msgKupacRel.getMsgId());
						}
					}
				}
			}
			
			if(ad.getStatus() == 1) {		//proizvod u dostavljenim
				
				for(User u : userDAO.getUsers().values()) {
					
					if(u.getRole() == 0 || u.getRole() == 2)
						continue;
					
					for(int i = 0; i < u.getBuyerDeliveredAds().size(); i++) {
						if(u.getBuyerDeliveredAds().get(i).equals(ad.getIdAd())) {
							
							Message msgKupacDel = new Message(ad.getName(), "Automatizovana poruka", "Webshop", u.getUsername(),
									"Admin " + user.getUsername() + " je obrisao vas oglas koji je bio dostavljen!", miliseconds);
							messageDao.addMessages(msgKupacDel, ctx.getRealPath(""));
							
							oldUsers.get(u.getUsername()).getSellerMessages().add(msgKupacDel.getMsgId());
						}
					}
				}
				
			}
		
		}
		
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
			
		return Response.status(200).build();
	}
	
	@POST
	@Path("/addToFavourites/{idAd}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addToFavourites(@PathParam("idAd") String idAd, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		
		HashMap<String, User> oldUsers = userDAO.getUsers();
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		
		oldUsers.get(user.getUsername()).getBuyerFavouriteAds().add(UUID.fromString(idAd));
		oldAds.get(UUID.fromString(idAd)).favUp();
		
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/addToOrdered/{idAd}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response orderAd(@PathParam("idAd") String idAd, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		oldAds.get(UUID.fromString(idAd)).setStatus(0);
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
		
		
		HashMap<String, User> oldUsers = userDAO.getUsers();
		oldUsers.get(user.getUsername()).getBuyerOrderedAds().add(UUID.fromString(idAd));
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/removeFromFavourites/{idAd}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeFromFavourites(@PathParam("idAd") String idAd, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		
		ArrayList<UUID> favAds = user.getBuyerFavouriteAds();
		
		for(int i = 0; i < favAds.size(); i++) {
			if(favAds.get(i).equals(UUID.fromString(idAd))) {
				System.out.println("USAO U IF");
				favAds.remove(i);
			}
		}
		
		HashMap<String, User> oldUsers = userDAO.getUsers();
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		
		oldUsers.get(user.getUsername()).setBuyerFavouriteAds(favAds);
		oldAds.get(UUID.fromString(idAd)).favDown();
		
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/addToDelivered/{idAd}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response deliveredAd(@PathParam("idAd") String idAd, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		MessageDAO messageDao = (MessageDAO)ctx.getAttribute("messageDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		oldAds.get(UUID.fromString(idAd)).setStatus(1);
		
		HashMap<String, User> oldUsers = userDAO.getUsers();
		ArrayList<UUID> orderedAds = oldUsers.get(user.getUsername()).getBuyerOrderedAds();
		
		for(int i = 0; i < orderedAds.size(); i++) {
			if(orderedAds.get(i).equals(UUID.fromString(idAd))) {
				orderedAds.remove(i);
			}
		}
		
		oldUsers.get(user.getUsername()).setBuyerOrderedAds(orderedAds);
		oldUsers.get(user.getUsername()).getBuyerDeliveredAds().add(UUID.fromString(idAd));
		
		User publisher = oldUsers.get(oldAds.get(UUID.fromString(idAd)).getPublisher());
		
		Date d = new Date();
		long miliseconds = d.getTime();
		
		Message msg = new Message(oldAds.get(UUID.fromString(idAd)).getName(), "Automatizovana poruka", "Webshop", 
				publisher.getUsername(), "Proizvod je uspesno dostavljen kupcu: " + user.getUsername() + ".", miliseconds);
		
		
		HashMap<UUID, Message> oldMessages = messageDao.getMessages();
		oldMessages.put(msg.getMsgId(), msg);
		
		oldUsers.get(publisher.getUsername()).getSellerMessages().add(msg.getMsgId());
		
		messageDao.msgChanged(oldMessages, ctx.getRealPath(""));
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/likeAd/{idAd}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response likeAd(@PathParam("idAd") String idAd, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		oldAds.get(UUID.fromString(idAd)).likeUp();
		
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/likeSeller/{seller}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response likeSeller(@PathParam("seller") String sellerUsername, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<String, User> oldUsers = userDAO.getUsers();
		oldUsers.get(sellerUsername).sellerLikesUp();
		
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/dislikeSeller/{seller}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response dislikeSeller(@PathParam("seller") String sellerUsername, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<String, User> oldUsers = userDAO.getUsers();
		oldUsers.get(sellerUsername).sellerDislikesUp();
		
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	@POST
	@Path("/dislikeAd/{idAd}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response dislikeAd(@PathParam("idAd") String idAd, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		oldAds.get(UUID.fromString(idAd)).dislikeUp();
		
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
}