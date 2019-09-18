package beans;

import java.io.Serializable;
import java.util.UUID;

public class Recension implements Serializable{

	private static final long serialVersionUID = 1447320359911214458L;
	
	private UUID recensionId;
	private UUID adId;
	private String recensionist;
	private String recensionName;
	private String recensionContent;
	private String img;
	private boolean isDescriptionCorrect;
	private boolean isFullfiled;
	private boolean active;
	
	public Recension() {
		
	}

	public Recension(UUID adId, String recensionist, String recensionName, String recensionContent, String img,
			boolean isDescriptionCorrect, boolean isFullfiled) {
		super();
		this.recensionId = UUID.randomUUID();
		this.adId = adId;
		this.recensionist = recensionist;
		this.recensionName = recensionName;
		this.recensionContent = recensionContent;
		this.img = img;
		this.isDescriptionCorrect = isDescriptionCorrect;
		this.isFullfiled = isFullfiled;
		this.active = true;
	}
	

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public UUID getRecensionId() {
		return recensionId;
	}

	public void setRecensionId(UUID recensionId) {
		this.recensionId = recensionId;
	}

	public UUID getAdId() {
		return adId;
	}

	public void setAdId(UUID adId) {
		this.adId = adId;
	}

	public String getRecensionist() {
		return recensionist;
	}

	public void setRecensionist(String recensionist) {
		this.recensionist = recensionist;
	}

	public String getRecensionName() {
		return recensionName;
	}

	public void setRecensionName(String recensionName) {
		this.recensionName = recensionName;
	}

	public String getRecensionContent() {
		return recensionContent;
	}

	public void setRecensionContent(String recensionContent) {
		this.recensionContent = recensionContent;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public boolean isDescriptionCorrect() {
		return isDescriptionCorrect;
	}

	public void setDescriptionCorrect(boolean isDescriptionCorrect) {
		this.isDescriptionCorrect = isDescriptionCorrect;
	}

	public boolean isFullfiled() {
		return isFullfiled;
	}

	public void setFullfiled(boolean isFullfiled) {
		this.isFullfiled = isFullfiled;
	}
	

}
