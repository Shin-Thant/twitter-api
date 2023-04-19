// import { Types } from "mongoose";
// import { CommentRef, LeanComment } from "../models/Comment";
// import { LeanUser, UserRef } from "../models/User";
// import { LeanTweet, TweetRef } from "../models/types/tweetTypes";

//! This function failed. Continue testing when it is necessary.

// type LeanDoc = LeanUser | LeanTweet | LeanComment;
// type Doc = UserRef | TweetRef | CommentRef;

// export default function isDocumentLeaned<TLeanDoc extends LeanDoc | LeanDoc[]>(
// 	doc: Doc | Doc[]
// ): doc is TLeanDoc {
// 	if (Array.isArray(doc)) {
// 		console.log("array", doc[0] instanceof Types.ObjectId);

// 		return doc.every((item) => item instanceof Types.ObjectId);
// 	}

// 	return doc instanceof Types.ObjectId;
// }
