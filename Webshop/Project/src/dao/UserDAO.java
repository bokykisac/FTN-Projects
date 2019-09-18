package dao;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.User;

public class UserDAO {
	
	private HashMap<String, User> users = new HashMap<>();
	
	public UserDAO() {
		
	}
	
	public UserDAO(String contextPath) {
		loadUsers(contextPath);
	}
	
	private void loadUsers(String contextPath) {
		
		try {
			File file = new File(contextPath +  "/users.json");
			System.out.println(contextPath);
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
					
			User[] readUsers = null;
			
			if(file.exists() && file.length() != 0) {
				readUsers = objectMapper.readValue(file, User[].class);
				
				for(User u : readUsers) {
					users.put(u.getUsername(), u);
				}
				
			}else {
				file.createNewFile();
				ArrayList<User> newUsers = new ArrayList<>();
				User kupac1 = new User("prodavac1", "prodavac1", "Zika", "Zikic", 2, "555-333", "Novi Sad", "kupac_1@gmail.com", "10.7.1997");
				User kupac2 = new User("prodavac2", "prodavac2", "Milan", "Milanovic", 2, "111-222", "Novi Sad", "kupac_2@gmail.com", "6.11.1994");
				User kupac3 = new User("prodavac3", "prodavac3", "Ivan", "Ivanovic", 2, "333-444", "Novi Sad", "kupac_3@gmail.com", "2.6.1989");
				
				newUsers.add(kupac1);
				newUsers.add(kupac2);
				newUsers.add(kupac3);	
				newUsers.add(new User("admin", "admin", "Boris", "Zavis", 0, "000-111", "Kisac", "dervy97@gmail.com", "10.07.1997"));
				newUsers.add(new User("kupac", "kupac", "Pera", "Peric", 1, "555-666", "Beograd", "prodavac97@gmail.com", "10.3.1991"));
				objectMapper.writeValue(new File(contextPath + "/users.json"), newUsers);
				
				readUsers = objectMapper.readValue(file, User[].class);
				
				for(User u : readUsers) {
					users.put(u.getUsername(), u);
				}
			}
			
		}
		catch(Exception e){
			e.printStackTrace();
		}
		finally {
			
		}
	}
	
	public User find(String username, String password) {
		if (!users.containsKey(username)) {
			return null;
		}
		User user = users.get(username);
		if (!user.getPassword().equals(password)) {
			return null;
		}
		return user;
	}
	
	public Collection<User> findAll() {
		return users.values();
	}

	public HashMap<String, User> getUsers() {
		return users;
	}

	public void setUsers(HashMap<String, User> users) {
		this.users = users;
	}
	
	public boolean find(String username) {
		if(!users.containsKey(username)) {
			return false;
		}
		
		return true;
	}
	
	public void addUser(User u, String contextPath) {
		
		try {
			File file = new File(contextPath + "/users.json");
			System.out.println(contextPath);
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
			
			ArrayList<User> korisnici = new ArrayList<>();
			
			
			User[] postojeci = objectMapper.readValue(file, User[].class);
			
			for(User user : postojeci) {
				korisnici.add(user);
			}
			korisnici.add(u);
			
			objectMapper.writeValue(new File(contextPath + "/users.json"), korisnici);
			users.put(u.getUsername(), u);
			
			System.out.println(users);
		}
		catch(Exception e){
			System.out.println(e);
			e.printStackTrace();
		}
		finally {
			
		}
		
	}
	
	public void userChanged(HashMap<String, User> users, String contextPath) {
		
		try {
			//File file = new File(contextPath + "/users.json");
			System.out.println(contextPath);
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
			objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
			
			ArrayList<User> korisnici = new ArrayList<>();
			
			for(User u : users.values()) {
				korisnici.add(u);
			}
			
			objectMapper.writeValue(new File(contextPath + "/users.json"), korisnici);
			
			System.out.println(users + " U NOVOM FAJLU");
		}
		catch(Exception e) {
			System.out.println(e);
			e.printStackTrace();
		}
		finally {
			
		}
	}

}
