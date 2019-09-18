package beans;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.UUID;

public class User implements Serializable{
	
	private static final long serialVersionUID = -5530131067846807534L;
	
	private String username;
	private String password;
	private String firstName;
	private String lastName;
	private int role;//	admin => 0,		kupac => 1,	  prodavac => 2
	private String phone;
	private String city;
	private String email;
	private String date;
	
	private ArrayList<UUID> buyerOrderedAds = new ArrayList<>();
	private ArrayList<UUID> buyerDeliveredAds = new ArrayList<>();
	private ArrayList<UUID> buyerFavouriteAds = new ArrayList<>();
	
	private ArrayList<UUID> sellerPostedAds = new ArrayList<>();
	private ArrayList<UUID> sellerSendAds = new ArrayList<>();
	private ArrayList<UUID> sellerMessages = new ArrayList<>();
	private int sellerLikes;
	private int sellerDislikes;
	
	public User() {
		
	}
	
	public User(String username, String password, String firstName, String lastName, int role, String phone,
			String city, String email, String date) {
		
		super();
		this.username = username;
		this.password = password;
		this.firstName = firstName;
		this.lastName = lastName;
		this.role = role;
		this.phone = phone;
		this.city = city;
		this.email = email;
		this.date = date;
	}
	
	public void sellerLikesUp() {
		this.sellerLikes++;
	}
	
	public void sellerLikesDown() {
		this.sellerLikes--;
	}
	
	public void sellerDislikesUp() {
		this.sellerDislikes++;
	}
	
	public void sellerDislikesDown() {
		this.sellerDislikes--;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public int getRole() {
		return role;
	}

	public void setRole(int role) {
		this.role = role;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public ArrayList<UUID> getBuyerOrderedAds() {
		return buyerOrderedAds;
	}

	public void setBuyerOrderedAds(ArrayList<UUID> buyerOrderedAds) {
		this.buyerOrderedAds = buyerOrderedAds;
	}

	public ArrayList<UUID> getBuyerDeliveredAds() {
		return buyerDeliveredAds;
	}

	public void setBuyerDeliveredAds(ArrayList<UUID> buyerDeliveredAds) {
		this.buyerDeliveredAds = buyerDeliveredAds;
	}

	public ArrayList<UUID> getBuyerFavouriteAds() {
		return buyerFavouriteAds;
	}

	public void setBuyerFavouriteAds(ArrayList<UUID> buyerFavouriteAds) {
		this.buyerFavouriteAds = buyerFavouriteAds;
	}

	public ArrayList<UUID> getSellerPostedAds() {
		return sellerPostedAds;
	}

	public void setSellerPostedAds(ArrayList<UUID> sellerPostedAds) {
		this.sellerPostedAds = sellerPostedAds;
	}

	public ArrayList<UUID> getSellerSendAds() {
		return sellerSendAds;
	}

	public void setSellerSendAds(ArrayList<UUID> sellerSendAds) {
		this.sellerSendAds = sellerSendAds;
	}

	public ArrayList<UUID> getSellerMessages() {
		return sellerMessages;
	}

	public void setSellerMessages(ArrayList<UUID> sellerMessages) {
		this.sellerMessages = sellerMessages;
	}

	public int getSellerLikes() {
		return sellerLikes;
	}

	public void setSellerLikes(int sellerLikes) {
		this.sellerLikes = sellerLikes;
	}

	public int getSellerDislikes() {
		return sellerDislikes;
	}

	public void setSellerDislikes(int sellerDislikes) {
		this.sellerDislikes = sellerDislikes;
	}

	
	
}
