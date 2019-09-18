package beans;

import java.io.Serializable;
import java.util.List;
import java.util.UUID;

public class Category implements Serializable{

	private static final long serialVersionUID = 9130567812082527733L;
	
	private String name;
	private String description;
	private boolean active;
	private List<UUID> advertisements;
	
	public Category() {
		
	}

	public Category(String name, String description, List<UUID> advertisements) {
		super();
		this.name = name;
		this.description = description;
		this.active = true;
		this.advertisements = advertisements;
	}
	

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public List<UUID> getAdvertisements() {
		return advertisements;
	}

	public void setAdvertisements(List<UUID> advertisements) {
		this.advertisements = advertisements;
	}

}
