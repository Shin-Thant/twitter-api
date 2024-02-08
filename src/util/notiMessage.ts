export class NotiMessage {
	static getLikeTweetMessage(recipientName: string) {
		return `${recipientName} liked your tweet.`;
	}
	static getLikeCommentMessage(recipientName: string) {
		return `${recipientName} liked your comment.`;
	}
	static getCommentMessage(recipientName: string) {
		return `${recipientName} commented on your tweet.`;
	}
	static getReplyMessage(recipientName: string) {
		return `${recipientName} replied on your comment.`;
	}
}
