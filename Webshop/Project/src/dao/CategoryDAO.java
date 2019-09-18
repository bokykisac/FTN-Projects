package dao;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Category;

public class CategoryDAO {
	
	private HashMap<String, Category> categories = new HashMap<>();
	
	public CategoryDAO() {
		
	}
	
	public CategoryDAO(String contextPath) {
		loadCategories(contextPath);
	}
	
	public Category find(String name) {
		if(!categories.containsKey(name)) {
			return null;
		}
		
		Category cat = categories.get(name);
		
		return cat;
	}
	
	public Collection<Category> findAll(){
		return categories.values();
	}
	
	public HashMap<String, Category> getCategories(){
		return categories;
	}
	
	private void loadCategories(String contextPath) {
		
		try {
			File file = new File(contextPath + "/categories.json");
			ObjectMapper om = new ObjectMapper();
			om.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			om.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
			
			Category[] readCategories = null;			
			
			if(file.exists() && file.length() != 0) {
				readCategories = om.readValue(file, Category[].class);
				
				for(Category cat : readCategories) {
					categories.put(cat.getName(), cat);
				}
			}
			else {
				file.createNewFile();
				ArrayList<Category> newCategories = new ArrayList<>();
				newCategories.add(new Category("Kategorija1", "Opis kategorije 1", new ArrayList<>()));
				newCategories.add(new Category("Kategorija2", "Opis kategorije 2", new ArrayList<>()));
				newCategories.add(new Category("Kategorija3", "Opis kategorije 3", new ArrayList<>()));
				
				om.writeValue(new File(contextPath + "/categories.json"), newCategories);
				
				readCategories = om.readValue(file, Category[].class);
				
				for(Category c : readCategories) {
					categories.put(c.getName(), c);
				}


			}
					
			
		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			
		}
		
	}
	
	@SuppressWarnings("unused")
	private void addCategory(Category cat, String contextPath) {
		
		try {
			File file = new File(contextPath + "/categories.json");
			ObjectMapper om = new ObjectMapper();
			om.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			om.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
			
			ArrayList<Category> cats = new ArrayList<>();
			
			Category[] prevCats = om.readValue(file, Category[].class);
			
			for(Category c : prevCats) {
				cats.add(c);
			}
			
			cats.add(cat);
		
			om.writeValue(new File(contextPath + "/categories.json"), cats);
			categories.put(cat.getName(), cat);

		}catch(Exception e) {
			e.printStackTrace();
		}finally {
			
		}
		
	}
	
	public void categoryChanged(HashMap<String, Category> cats, String contextPath) {
		
		try {
		ObjectMapper om = new ObjectMapper();
		om.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
		om.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
		om.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
		
		ArrayList<Category> prevCats = new ArrayList<>();
		
		for(Category c : cats.values()) {
			prevCats.add(c);
		}
		
		om.writeValue(new File(contextPath + "/categories.json"), prevCats);
		
		}catch(Exception e){
			e.printStackTrace();
		}finally {
		
		}
	}

}
