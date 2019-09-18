package dao;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.UUID;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import beans.Message;

public class MessageDAO {
	
	private HashMap<UUID, Message> messages = new HashMap<>();
	
	public MessageDAO() {
		
	}
	
	public MessageDAO(String contextPath) {
		loadMessages(contextPath);
	}
	
	public Collection<Message> findAll(){
		return messages.values();
	}

	public HashMap<UUID, Message> getMessages() {
		return messages;
	}

	public void setMessages(HashMap<UUID, Message> messages) {
		this.messages = messages;
	}
	
	public Message findMessage(UUID id) {
		return messages.containsKey(id) ? messages.get(id) : null;
	}
	
	public boolean serachMessage(UUID id) {
		return messages.containsKey(id) ? true : null;
	}
	
public void loadMessages(String contextPath) {
		
		try {
			File file = new File(contextPath + "/messages.json");
			ObjectMapper om = new ObjectMapper();
			om.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
			om.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
			om.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);			
			
			Message[] msgs = null;
			
			if(file.exists() && file.length() != 0) {
				msgs = om.readValue(file, Message[].class);
				
				for(Message m : msgs) {
					messages.put(m.getMsgId(), m);
				}
			}else {
				file.createNewFile();
				ArrayList<Message> poruke = new ArrayList<>();
				
				poruke.add(new Message("Oglascina", "Porukica1", "Mirko", "Zarko", "Ovo je poruka", 100));
				
				om.writeValue(new File(contextPath + "/messages.json"), poruke);
				
				msgs = om.readValue(file, Message[].class);
				
				for(Message m : msgs) {
					messages.put(m.getMsgId(), m);
				}
						
			}
		}catch(Exception e) {
			e.printStackTrace();
		}finally{
			
		}
	}

public void addMessages(Message message, String contextPath) {
	
	try {
		File file = new File(contextPath + "/messages.json");
		ObjectMapper om = new ObjectMapper();
		om.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
		om.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
		om.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
		
		ArrayList<Message> oldMessages = new ArrayList<>();
		
		Message[] readMsgs = om.readValue(file, Message[].class);
		
		for(Message m : readMsgs) {
			oldMessages.add(m);
		}
		oldMessages.add(message);
		
		om.writeValue(new File(contextPath + "/messages.json"), oldMessages);
		messages.put(message.getMsgId(), message);
		
		System.out.println(messages);
		System.out.println(oldMessages);
		
	}
	catch(Exception e) {
		e.printStackTrace();
	}
	finally {
		
	}
}

public void msgChanged(HashMap<UUID, Message> msgs, String contextPath) {
	
	try {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.configure(DeserializationFeature.ACCEPT_SINGLE_VALUE_AS_ARRAY, true);
		objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
		objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_ARRAY_AS_NULL_OBJECT, true);
		
		ArrayList<Message> oldMessages = new ArrayList<>();
		
		for(Message m : msgs.values()) {
			oldMessages.add(m);
		}
		
		objectMapper.writeValue(new File(contextPath + "/messages.json"), oldMessages);
		
		System.out.println(msgs + " U NOVOM FAJLU");
	}
	catch(Exception e) {
		System.out.println(e);
		e.printStackTrace();
	}
	finally {
		
	}
}


}
