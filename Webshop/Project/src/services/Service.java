package services;

import java.util.ArrayList;
import java.util.Collection;
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
import beans.Category;
import beans.User;
import dao.AdvertisementDAO;
import dao.CategoryDAO;
import dao.UserDAO;

@Path("")
public class Service {
	
	@Context
	ServletContext ctx;
	
	public Service() {
		
	}
	
	@PostConstruct
	// ctx polje je null u konstruktoru, mora se pozvati nakon konstruktora (@PostConstruct anotacija)
	public void init() {
		// Ovaj objekat se instancira vi�e puta u toku rada aplikacije
		// Inicijalizacija treba da se obavi samo jednom
		if (ctx.getAttribute("userDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("userDAO", new UserDAO(contextPath));
		}
		
		if(ctx.getAttribute("categoryDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("categoryDAO", new CategoryDAO(contextPath));
		}
	}
	
	@POST
	@Path("/login")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response login(User user, @Context HttpServletRequest request) {
		
		UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
		
		User loggedUser = userDao.find(user.getUsername(), user.getPassword());
		
		if(loggedUser == null) {
			return Response.status(400).entity("Invalid username and/or password").build();
		}
						
		request.getSession().setAttribute("user", loggedUser);
		return Response.status(200).build();
	}
	
	@GET
	@Path("/getUsers")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<User> users(@Context HttpServletRequest request) {
		
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		return userDAO.findAll();
	}
	
	@GET
	@Path("/initSellers")
	public void loadLists(@Context HttpServletRequest request) {
		
		AdvertisementDAO advertisementDAO = (AdvertisementDAO)ctx.getAttribute("AdvertisementDAO");
		UserDAO userDAO = (UserDAO)ctx.getAttribute("userDAO");
		CategoryDAO categoriesDAO = (CategoryDAO)ctx.getAttribute("categoryDAO");
		
		HashMap<String, User> oldUsers = userDAO.getUsers();
		HashMap<UUID, Advertisement> oldAds = advertisementDAO.getAds();
		HashMap<String, Category> oldCats = categoriesDAO.getCategories();
		
		int counter = 0;
		int sellerNum = 0;
		
		if(oldAds.size() < 10)
			return;
		
		if(oldUsers.size() != 5)
			return;
		
		ArrayList<User> sellers = new ArrayList<>();
		ArrayList<Category> cats = new ArrayList<>();
		
		for(User u : oldUsers.values()) {
			
			if(u.getRole() != 2)
				continue;
			
			sellers.add(u);
		}
		
		for(Category c : oldCats.values()) {
			cats.add(c);
		}
		
		
		for(Advertisement a : oldAds.values()) {
			sellers.get(sellerNum).getSellerPostedAds().add(a.getIdAd());
			cats.get(sellerNum).getAdvertisements().add(a.getIdAd());
			oldAds.get(a.getIdAd()).setPublisher(sellers.get(sellerNum).getUsername());
			counter++;
			
			if(counter == 2)
				sellerNum++;
			
			if(counter == 7)
				sellerNum++;
		}
		
		for(Category c : oldCats.values()) {
			for(int i = 0; i < cats.size(); i ++) {
				if(c.getName() == cats.get(i).getName()) {
					oldCats.replace(c.getName(), cats.get(i));
				}
			}
		}
		
		for(User u : oldUsers.values()) {
			for(int i = 0; i < sellers.size(); i++) {
				if(u.getUsername() == sellers.get(i).getUsername()) {
					oldUsers.replace(u.getUsername(), sellers.get(i));
				}
			}
		}
		
		advertisementDAO.adChanged(oldAds, ctx.getRealPath(""));
		categoriesDAO.categoryChanged(oldCats, ctx.getRealPath(""));
		userDAO.userChanged(oldUsers, ctx.getRealPath(""));

	}
	
	@POST
	@Path("/register")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response registracija(User u, @Context HttpServletRequest request) {
		
		UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
		
		User user = userDao.find(u.getUsername(), u.getPassword());
		
		if(user != null) {
			return Response.status(400).build();
		}
		
		String path = ctx.getRealPath("");
		userDao.addUser(u, path);
		
		ctx.setAttribute("userD"
				+ "AO", userDao);
		return Response.status(200).build();
	}
	
	@GET
	@Path("/currentUser")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public User login(@Context HttpServletRequest request) {
		
		return (User) request.getSession().getAttribute("user");
		
	}
	
	@POST
	@Path("/logout")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void logout(@Context HttpServletRequest request) {
		request.getSession().invalidate();
	}
	
	@POST
	@Path("/changeRole/{username}/{role}")
	public void changeRole(@PathParam("username") String username, @PathParam("role") int role, @Context HttpServletRequest request) {
		
		System.out.println("USAO U CHANGEROLE");
		
		UserDAO userDao = (UserDAO) ctx.getAttribute("userDAO");
		
		HashMap<String, User> oldUsers = userDao.getUsers();
		oldUsers.get(username).setRole(role);
		System.out.println("ovo je role" + role);
		System.out.println("ovo je username" + username);
		
		userDao.userChanged(oldUsers, ctx.getRealPath(""));
		
		System.out.println("KRAJ CHANGEROLE");
		
	}
	
	
	
	
}