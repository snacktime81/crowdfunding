interface Item {
	id: number,
	name: string,
	deadline: Date,
	percent: number,
	price: number,
	userId?: number,
	img?: string,
}

export { Item };