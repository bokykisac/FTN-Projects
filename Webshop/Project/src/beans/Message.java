package beans;

import java.io.Serializable;
import java.util.UUID;

public class Message implements Serializable{
	
	private static final long serialVersionUID = 411167450166942170L;
	
	private UUID msgId;
	private String adName;
	private String msgName;
	private String msgSender;
	private String msgReciver;
	private String msgContent;
	private long msgDate;
	private boolean deleted;
	private boolean read;
	
	public Message() {
		
	}

	public Message(String adName, String msgName, String msgSender, String msgReciver, String msgContent, long msgDate) {
		super();
		this.msgId = UUID.randomUUID();
		this.adName = adName;
		this.msgName = msgName;
		this.msgSender = msgSender;
		this.msgReciver = msgReciver;
		this.msgContent = msgContent;
		this.msgDate = msgDate;
		this.deleted = false;
		this.read = false;
	}
	
	

	public String getMsgReciver() {
		return msgReciver;
	}

	public void setMsgReciver(String msgReciver) {
		this.msgReciver = msgReciver;
	}

	public String getMsgSender() {
		return msgSender;
	}

	public void setMsgSender(String msgSender) {
		this.msgSender = msgSender;
	}

	public UUID getMsgId() {
		return msgId;
	}

	public void setMsgId(UUID msgId) {
		this.msgId = msgId;
	}

	public String getAdName() {
		return adName;
	}

	public void setAdName(String adName) {
		this.adName = adName;
	}

	public String getMsgName() {
		return msgName;
	}

	public void setMsgName(String msgName) {
		this.msgName = msgName;
	}

	public String getMsgContent() {
		return msgContent;
	}

	public void setMsgContent(String msgContent) {
		this.msgContent = msgContent;
	}

	public long getMsgDate() {
		return msgDate;
	}

	public void setMsgDate(long msgDate) {
		this.msgDate = msgDate;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public boolean isRead() {
		return read;
	}

	public void setRead(boolean read) {
		this.read = read;
	}

}
