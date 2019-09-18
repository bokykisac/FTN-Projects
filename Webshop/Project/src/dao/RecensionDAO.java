package dao;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.UUID;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;

import beans.Recension;

public class RecensionDAO {
	
	private HashMap<UUID, Recension> recensions = new HashMap<>();
	
	public RecensionDAO() {
		
	}
	
	
	public RecensionDAO(String contextPath) {
		loadRecensions(contextPath);
	}
	
	public Collection<Recension> findAll(){
		return recensions.values();
	}
	
	public HashMap<UUID, Recension> getRecensions(){
		return recensions;
	}
	
	public Recension findRecension(UUID id) {
		return recensions.containsKey(id) ? recensions.get(id) : null;
	}
	
	public boolean searchRecension(UUID id) {
		return recensions.containsKey(id) ? true : null;
	}
	
	public void setRecensions(HashMap<UUID, Recension> recs) {
		this.recensions = recs;
	}
	
	public void loadRecensions(String contextPath) {
		
		try {
			File file = new File(contextPath + "/recensions.json");
			ObjectMapper om = new ObjectMapper();
			om.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			om.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
			om.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
			
			
			Recension[] recs = null;
			
			if(file.exists() && file.length() != 0) {
				recs = om.readValue(file, Recension[].class);
				
				for(Recension r : recs) {
					recensions.put(r.getRecensionId(), r);
				}
			}
			else {
				file.createNewFile();
				ArrayList<Recension> newRecs = new ArrayList<>();
				//ovde pravimo recensije ako hocemo defaultne
				
				om.writeValue(new File(contextPath + "/recensions.json"), newRecs);
				
				recs = om.readValue(file, Recension[].class);
				for(Recension r : recs) {
					recensions.put(r.getRecensionId(), r);
				}
			}	
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		finally {
			
		}			
	}
	
	public void addRecension(Recension r, String contextPath) {
		
		try {
			
			File file = new File(contextPath + "/recensions.json");
			ObjectMapper om = new ObjectMapper();
			om.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			om.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
			om.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
			
			ArrayList<Recension> oldRecs = new ArrayList<>();
			Recension[] readRecs = om.readValue(file, Recension[].class);
			
			for(Recension rec : readRecs) {
				oldRecs.add(rec);
			}
			
			oldRecs.add(r);
			
			om.writeValue(new File(contextPath + "/recensions.json"), oldRecs);
			recensions.put(r.getRecensionId(), r);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
		finally {
			
		}
	}
	
	public void recensionChanged(HashMap<UUID, Recension> newRecs, String contextPath) {
		
		try {
	
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
			objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
			
			ArrayList<Recension> recs = new ArrayList<>();
			
			for(Recension r : newRecs.values()) {
				recs.add(r);
			}
			
			objectMapper.writeValue(new File(contextPath + "/recensions.json"), recs);
			
		}
		catch(Exception e){
			e.printStackTrace();
		}
		finally {
			
		}
	}	
}
