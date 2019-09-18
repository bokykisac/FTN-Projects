package beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.UUID;

public class Advertisement implements Serializable{

	private static final long serialVersionUID = 569352819824166903L;
	
	private UUID idAd;
	private String name;
	private String publisher;
	private double price;
	private String description;
	private int numLikes;
	private int numDislikes;
	private String imgPath;
	private String datePublished;
	private String dateExpired;
	private boolean active;
	private String city;
	private ArrayList<UUID> recensions;
	private int status; //-1 => nista, 0 => u realizaciji, 1 => dostavljen
	private int numFavourites;
	
	public Advertisement() {
		
	}

	public Advertisement(String name, String publisher, double price, String description, int numLikes, int numDislikes,
			String imgPath, String datePublished, String dateExpired, boolean active, String city) {
		
		super();
		this.idAd = UUID.randomUUID();
		this.name = name;
		this.publisher = publisher;
		this.price = price;
		this.description = description;
		this.numLikes = numLikes;
		this.numDislikes = numDislikes;
		this.imgPath = imgPath;
		this.datePublished = datePublished;
		this.dateExpired = dateExpired;
		this.active = active;
		this.city = city;
		this.recensions = new ArrayList<>();
		this.status = -1;
		this.numFavourites = 0;
		
	}
	
	public void favUp() {
		this.numFavourites++;
	}
	
	public void favDown() {
		this.numFavourites--;
	}
	
	public void likeUp() {
		this.numLikes++;
	}
	
	public void dislikeUp() {
		this.numDislikes++;
	}
	
	public void likeDown() {
		this.numLikes--;
	}
	
	public void dislikeDown() {
		this.numDislikes--;
	}
	
	public int getNumFavourites() {
		return numFavourites;
	}

	public void setNumFavourites(int numFavourites) {
		this.numFavourites = numFavourites;
	}

	public String getPublisher() {
		return publisher;
	}

	public void setPublisher(String publisher) {
		this.publisher = publisher;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public UUID getIdAd() {
		return idAd;
	}

	public void setIdAd(UUID idAd) {
		this.idAd = idAd;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getNumLikes() {
		return numLikes;
	}

	public void setNumLikes(int numLikes) {
		this.numLikes = numLikes;
	}

	public int getNumDislikes() {
		return numDislikes;
	}

	public void setNumDislikes(int numDislikes) {
		this.numDislikes = numDislikes;
	}

	public String getImgPath() {
		return imgPath;
	}

	public void setImgPath(String imgPath) {
		this.imgPath = imgPath;
	}

	public String getDatePublished() {
		return datePublished;
	}

	public void setDatePublished(String datePublished) {
		this.datePublished = datePublished;
	}

	public String getDateExpired() {
		return dateExpired;
	}

	public void setDateExpired(String dateExpired) {
		this.dateExpired = dateExpired;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public ArrayList<UUID> getRecensions() {
		return recensions;
	}

	public void setRecensions(ArrayList<UUID> recensions) {
		this.recensions = recensions;
	}

}
