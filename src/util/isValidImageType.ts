const ALLOWED_TYPES = ["png", "jpg", "jpeg"] as const;
type TYPE = (typeof ALLOWED_TYPES)[number];

const TYPE_INDEX = 1 as const;
const SPLIT_CHAR = "/" as const;

export function isValidImageType(mimetype: string): mimetype is TYPE {
	const type = mimetype.split(SPLIT_CHAR)[TYPE_INDEX];

	return !!ALLOWED_TYPES.find((t) => t === type);
}
