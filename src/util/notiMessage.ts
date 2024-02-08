export class NotiMessage {
	static getLikeTweetMessage(triggerUserName: string) {
		return `${triggerUserName} liked your tweet.`;
	}
	static getLikeCommentMessage(triggerUserName: string) {
		return `${triggerUserName} liked your comment.`;
	}
	static getCommentMessage(triggerUserName: string) {
		return `${triggerUserName} commented on your tweet.`;
	}
	static getReplyMessage(triggerUserName: string) {
		return `${triggerUserName} replied on your comment.`;
	}
}
