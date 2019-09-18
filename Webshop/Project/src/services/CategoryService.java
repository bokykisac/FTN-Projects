package services;

import java.util.Collection;
import java.util.HashMap;

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

import beans.Category;
import beans.User;
import dao.CategoryDAO;

@Path("category")
public class CategoryService {
	
	@Context
	ServletContext ctx;
	
	public CategoryService() {
		
	}
	
	@PostConstruct
	public void init() {
		if(ctx.getAttribute("categoryDAO") == null) {
			String contextPath = ctx.getRealPath("");
			ctx.setAttribute("categoryDAO", new CategoryDAO(contextPath));
		}
	}
	
	
	@GET
	@Path("/getCategories")
	@Produces(MediaType.APPLICATION_JSON)
	public Collection<Category> ads() {
		
		CategoryDAO categoriesDAO = (CategoryDAO)ctx.getAttribute("categoryDAO");
		return categoriesDAO.findAll();
	}
	
	@POST
	@Path("/addCategory")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response addCategory(Category cat, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		CategoryDAO categoryDAO = (CategoryDAO)ctx.getAttribute("categoryDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<String, Category> oldCats = categoryDAO.getCategories();
		oldCats.put(cat.getName(), cat);
		categoryDAO.categoryChanged(oldCats, ctx.getRealPath(""));
		
		return Response.status(200).build();
		
	}
	
	
	@POST
	@Path("/changeCategory/{catName}")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response changeCategory(@PathParam("catName") String catName, Category cat, @Context HttpServletRequest request) {
		
		User user = (User)request.getSession().getAttribute("user");
		CategoryDAO categoryDAO = (CategoryDAO)ctx.getAttribute("categoryDAO");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<String, Category> oldCats = categoryDAO.getCategories();
		
		oldCats.remove(catName);
		oldCats.put(cat.getName(), cat);
		
		categoryDAO.categoryChanged(oldCats, ctx.getRealPath(""));
		
		return Response.status(200).build();
		
	}
	
	
	@GET
	@Path("/removeCat/{catName}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response removeCat(@PathParam("catName") String catName, @Context HttpServletRequest request) {
		
		CategoryDAO categoryDAO = (CategoryDAO)ctx.getAttribute("categoryDAO");
		User user = (User)request.getSession().getAttribute("user");
		
		if(user == null) {
			return Response.status(400).build();
		}
		
		HashMap<String, Category> oldCats = categoryDAO.getCategories();
		oldCats.get(catName).setActive(false);
		
		categoryDAO.categoryChanged(oldCats, ctx.getRealPath(""));
		
		return Response.status(200).build();
	}
	
	
	
	
}