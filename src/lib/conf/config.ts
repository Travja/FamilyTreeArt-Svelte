import { TreeArtConfig, TreeArtPage, TreeType } from './TreeArtConfig';

const config: TreeArtConfig = new TreeArtConfig();

/** Page 1 **/
config.addPage(new TreeArtPage({
	title: 'Who do you want your custom family tree art to feature?',
	intro: '<a href="http://customfamilytreeart.com/updates"><strong>*Do you want to update an existing tree?</strong></a>',
	options: [
		{
			name: '',
			id: 'type',
			type: 'image',
			//layer: 2,
			required: true,
			images: [
				{
					displayText: '<h3>Ancestors</h3><br/>The Trunk is a Couple or Individual, and the Branches are their Ancestors',
					displayImage: '/imgs/Option Examples/ANCESTRY Example.jpg',
					img: { show: 'reset' },
					reset: ['roots', 'generations'],
					addClass: [{
						id: ['svgBox'],
						value: 'shifted'
					}],
					set: {
						id: 'groundText',
						value: ''
					},
					key: 'ancestry'
				},
				{
					displayText: '<h3>Descendants</h3><br/>The Branches are the Descendants of the Trunk Couple or Individual',
					displayImage: '/imgs/Option Examples/DESCENDANT Example.jpg',
					key: 'descendant',
					img: {
						type: TreeType.DESCENDANT
						// couple: 'reset',
						// show: 'reset'
					}
					// reset: ['roots', 'ancType', 'generations'],
					// resetOption: ['couple'],
					// addClass: [{
					// 	id: ['svgBox'],
					// 	value: 'shifted'
					// }],
					// set: {
					// 	id: 'groundText',
					// 	value: ''
					// },
				},
				{
					group: {
						id: 'both',
						header: '<h3>Both</h3>',
						images: [
							{
								displayText: 'Descendant Tree with Ancestor Roots',
								displayImage: '/imgs/Option Examples/DESCENDANT TREE with 2 Gen ANCESTOR ROOTS.jpg',
								key: 'descendant_roots',
								img: {
									type: TreeType.DESCENDANT
									// couple: 'reset'
								}
								// reset: ['ancType'],
								// resetOption: ['couple'],
							},
							{
								displayText: 'Ancestor Tree with Descendant Roots',
								displayImage: '/imgs/Option Examples/Ancestry Tree with Descendant Roots.jpg',
								key: 'ancestry_roots',
								img: {
									type: TreeType.ANCESTRY
								}
							}
						]
					}
				}
			]
		}
	]
}));
/** Page 1.5 **/
config.addPage(new TreeArtPage({
	title: 'Ancestry - What type?',
	intro: 'Ancestry trees can be done as a couple or individual.',
	prereq: {
		option: 'type',
		value: ['ancestry', 'ancestry_roots']
	},
	options: [
		{
			name: '',
			id: 'ancType',
			required: true,
			// layer: 2,
			type: 'image',
			images: [
				{
					displayText: '<h3>Couple</h3><br/><span>The trunk is a couple' +
						'<br/>The tree has ancestors of both people</span>',
					key: 'ancestry_couple',
					summaryText: 'Ancestry Type: Couple',
					img: {
						type: TreeType.ANCESTRY,
						couple: 'Couple',
						default: {
							gen: '4 Gen'
						}
					}
				},
				{
					displayText: '<h3>Individual</h3><br/><span>The trunk is an individual' +
						'<br/>The tree has ancestors of one person</span>',
					key: 'ancestry_individual',
					summaryText: 'Ancestry Type: Individual',
					img: {
						type: TreeType.ANCESTRY,
						couple: 'Individual'
					}
				}
			]
		}
	]
}));
/** Page 2 **/
config.addPage(new TreeArtPage({
	//Page 2
	title: 'How many generations do you want to include in your tree?',
	intro: 'If you want to include more generations, or if you want a different arrangement click <a target=\'_blank\' href=\'http://customfamilytreeart.com/additional-designs\'>here.</a>',
	footer: '<b>*You will choose a print type and size in a later step</b>',
	options: [
		{
			name: '',
			required: true,
			layer: 2,
			id: 'generations',
			type: 'image',
			images: [
				{
					prereq: { //Ancestry
						option: 'type',
						value: ['ancestry']
					},
					displayText: '<h3>3 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Parents<br/>2nd Branches: Grandparents',
					summaryText: 'Ancestry - 3 Generation',
					cost: 0,
					key: 'ancestry_3gen',
					footer: '<strong>$40&nbsp;creation fee*</strong>',
					img: {
						gen: '3 Gen'
					}
					// reset: ['leaves']
				},
				{
					prereq: { //Ancestry
						option: 'type',
						value: ['ancestry_roots']
					},
					displayText: '<h3>3 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Parents<br/>2nd Branches: Grandparents',
					summaryText: 'Ancestry - 3 Generation',
					cost: 0,
					key: 'ancestry_3gen',
					footer: '<strong>$40&nbsp;creation fee*</strong>',
					img: {
						gen: '3 Gen'
					}
					// class: 'shrink',
					// set: {
					// 	id: 'groundText',
					// 	value: 'This is the ground. It can be a quote, family names, scripture, or favorite saying.'
					// },
					// addClass: [{
					// 	id: ['quoteText', 'familyWrapper'],
					// 	value: 'shift'
					// }],
					// reset: ['leaves']
				},
				{
					prereq: { //Ancestry
						option: 'type',
						value: ['ancestry']
					},
					displayText: '<h3>4 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Parents<br/>2nd Branches: Grandparents' +
						'<br/>3rd Branches: Great-Grandparents',
					summaryText: 'Ancestry - 4 Generation',
					cost: 0,
					key: 'ancestry_4gen',
					footer: '<strong>$50&nbsp;creation fee*</strong>',
					img: {
						gen: '4 Gen'
					}
					// reset: ['leaves']
				},
				{
					prereq: { //Ancestry
						option: 'type',
						value: ['ancestry_roots']
					},
					displayText: '<h3>4 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Parents<br/>2nd Branches: Grandparents' +
						'<br/>3rd Branches: Great-Grandparents',
					summaryText: 'Ancestry - 4 Generation',
					cost: 0,
					key: 'ancestry_4gen',
					footer: '<strong>$50&nbsp;creation fee*</strong>',
					img: {
						gen: '4 Gen'
					}
					// class: 'shrink',
					// set: {
					// 	id: 'groundText',
					// 	value: 'This is the ground. It can be a quote, family names, scripture, or favorite saying.'
					// },
					// addClass: [{
					// 	id: ['quoteText', 'familyWrapper'],
					// 	value: 'shift'
					// }],
					// reset: ['leaves']
				},
				{
					prereq: { //Ancestry
						option: 'type',
						value: ['ancestry'],
						and: {
							option: 'ancType',
							value: ['ancestry_individual']
						}
					},
					displayText: '<h3>5 Generations</h3><br/>Trunk: Individual' +
						'<br/>1st Branches: Parents<br/>2nd Branches: Grandparents' +
						'<br/>3rd Branches: Great-Grandparents<br/>4th Branches: Great-Great-Grandparents',
					summaryText: 'Ancestry - 5 Generation Individual',
					cost: 0,
					key: 'ancestry_5gen',
					footer: '<strong>$50&nbsp;creation fee*</strong>',
					img: {
						type: TreeType.ANCESTRY,
						gen: '5 Gen',
						couple: 'Individual'
					}
					// reset: ['leaves']
				},
				{
					prereq: { //Ancestry
						option: 'type',
						value: ['ancestry_roots'],
						and: {
							option: 'ancType',
							value: ['ancestry_individual']
						}
					},
					displayText: '<h3>5 Generations</h3><br/>Trunk: Individual' +
						'<br/>1st Branches: Parents<br/>2nd Branches: Grandparents' +
						'<br/>3rd Branches: Great-Grandparents<br/>4th Branches: Great-Great-Grandparents',
					summaryText: 'Ancestry - 5 Generation Individual',
					cost: 0,
					key: 'ancestry_5gen',
					footer: '<strong>$50&nbsp;creation fee*</strong>',
					img: {
						type: TreeType.ANCESTRY,
						gen: '5 Gen',
						couple: 'Individual'
					}
					// class: 'shrink',
					// set: {
					// 	id: 'groundText',
					// 	value: 'This is the ground. It can be a quote, family names, scripture, or favorite saying.'
					// },
					// addClass: [{
					// 	id: ['quoteText', 'familyWrapper'],
					// 	value: 'shift'
					// }],
					// reset: ['leaves']
				},
				{
					prereq: { //Descendant
						option: 'type',
						value: ['descendant']
					},
					displayText: '<h3>2 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Children<br/>2nd Branches: Information like Birth Dates, Nicknames, Favorite Colors, Personality Traits - anything that represents the children or family.',
					summaryText: 'Descendant - 2 Generation',
					cost: 0,
					key: 'descendant_2gen',
					footer: '<strong>$50&nbsp;creation fee*</strong>',
					img: {
						gen: '2 Gen'
					}
					// reset: ['leaves']
				},
				{
					prereq: { //Descendant
						option: 'type',
						value: ['descendant_roots']
					},
					displayText: '<h3>2 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Children<br/>2nd Branches: Information like Birth Dates, Nicknames, Favorite Colors, Personality Traits - anything that represents the children or family.',
					summaryText: 'Descendant - 2 Generation',
					cost: 0,
					key: 'descendant_2gen',
					footer: '<strong>$50&nbsp;creation fee*</strong>',
					img: {
						gen: '2 Gen'
					}
					// class: 'shrink',
					// set: {
					// 	id: 'groundText',
					// 	value: 'This is the ground. It can be a quote, family names, scripture, or favorite saying.'
					// },
					// addClass: [{
					// 	id: ['quoteText', 'familyWrapper'],
					// 	value: 'shift'
					// }],
					// reset: ['leaves']
				},
				{
					prereq: { //Descendant
						option: 'type',
						value: ['descendant']
					},
					displayText: '<h3>3 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Children<br/>2nd Branches: Grandchildren',
					summaryText: 'Descendant - 3 Generation',
					cost: 0,
					key: 'descendant_3gen',
					footer: '<strong>$50&nbsp;creation fee*</strong>',
					img: {
						gen: '3 Gen'
					}
					// reset: ['leaves']
				},
				{
					prereq: { //Descendant
						option: 'type',
						value: ['descendant_roots']
					},
					displayText: '<h3>3 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Children<br/>2nd Branches: Grandchildren',
					summaryText: 'Descendant - 3 Generation',
					cost: 0,
					key: 'descendant_3gen',
					footer: '<strong>$50&nbsp;creation fee*</strong>',
					img: {
						gen: '3 Gen'
					}
					// class: 'shrink',
					// set: {
					// 	id: 'groundText',
					// 	value: 'This is the ground. It can be a quote, family names, scripture, or favorite saying.'
					// },
					// addClass: [{
					// 	id: ['quoteText', 'familyWrapper'],
					// 	value: 'shift'
					// }],
					// reset: ['leaves']
				},
				{
					prereq: { //Descendant
						option: 'type',
						value: ['descendant']
					},
					displayText: '<h3>4 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Children<br/>2nd Branches: Grandchildren' +
						'<br/>3rd Branches: Great-Grandchildren',
					summaryText: 'Descendant - 4 Generation',
					cost: 0,
					key: 'descendant_4gen',
					footer: '<strong>$60&nbsp;creation fee*</strong>',
					img: {
						gen: '4 Gen'
					}
					// reset: ['leaves']
				},
				{
					prereq: { //Descendant
						option: 'type',
						value: ['descendant_roots']
					},
					displayText: '<h3>4 Generations</h3><br/>Trunk: Main Couple or Individual' +
						'<br/>1st Branches: Children<br/>2nd Branches: Grandchildren' +
						'<br/>3rd Branches: Great-Grandchildren',
					summaryText: 'Descendant - 4 Generation',
					cost: 0,
					key: 'descendant_4gen',
					footer: '<strong>$60&nbsp;creation fee*</strong>',
					img: {
						gen: '4 Gen'
					}
					// class: 'shrink',
					// set: {
					// 	id: 'groundText',
					// 	value: 'This is the ground. It can be a quote, family names, scripture, or favorite saying.'
					// },
					// addClass: [{
					// 	id: ['quoteText', 'familyWrapper'],
					// 	value: 'shift'
					// }],
					// reset: ['leaves']
				}
			]
		}
	]
}));
/** Page 3 **/
config.addPage(new TreeArtPage({
	title: 'How many generations of roots do you want?',
	intro: '',
	prereq: {
		option: 'type',
		value: ['descendant_roots', 'ancestry_roots']
	},
	options: [
		{
			name: '',
			type: 'image',
			id: 'roots',
			layer: 3,
			required: true,
			images: [
				{
					prereq: {
						option: 'type',
						value: ['descendant_roots']
					},
					displayText: '<h3>2 Generations</h3><br/>1st Roots: Parents<br/>2nd Roots: Grandparents',
					footer: '<h4 class=\'nomargin\'>$10</h4>',
					summaryText: 'Roots: Ancestry - 2 Generations',
					cost: 0,
					key: '2gen_ancestor',
					img: {
						use: 'roots',
						show: 'roots',
						roots: {
							type: TreeType.ANCESTRY,
							gen: '2 Gen'
						}
					}
				},
				{
					prereq: {
						option: 'type',
						value: ['descendant_roots']
					},
					displayText: '<h3>3 Generations</h3><br/>1st Roots: Parents<br/>2nd Roots: Grandparents' +
						'<br/>3rd Roots: Great-Grandparents',
					footer: '<h4 class=\'nomargin\'>$20</h4>',
					summaryText: 'Roots: Ancestry - 3 Generations',
					cost: 0,
					key: '3gen_ancestor',
					img: {
						use: 'roots',
						show: 'roots',
						roots: {
							type: TreeType.ANCESTRY,
							gen: '3 Gen'
						}
					}
				},
				{
					prereq: {
						option: 'type',
						value: ['ancestry_roots']
					},
					displayText: '<h3>2 Generations</h3><br/>1st Roots: Children<br/>2nd Roots: Grandchildren',
					footer: '<h4 class=\'nomargin\'>$10</h4>',
					summaryText: 'Roots: Descendant - 2 Generations',
					cost: 0,
					key: '2gen_descendant',
					img: {
						use: 'roots',
						show: 'roots',
						roots: {
							type: TreeType.DESCENDANT,
							gen: '2 Gen'
						}
					}
				},
				{
					prereq: {
						option: 'type',
						value: ['ancestry_roots']
					},
					displayText: '<h3>3 Generations</h3><br/>1st Roots: Children<br/>2nd Roots: Grandchildren' +
						'<br/>3rd Roots: Great-Grandchildren',
					footer: '<h4 class=\'nomargin\'>$20</h4>',
					summaryText: 'Roots: Descendant - 3 Generations',
					cost: 0,
					key: '3gen_descendant',
					img: {
						use: 'roots',
						show: 'roots',
						roots: {
							type: TreeType.DESCENDANT,
							gen: '3 Gen'
						}
					}
				}
			]
		}
	]
}));
/** Page 4 **/
config.addPage(new TreeArtPage({
	// Page 4
	title: 'Do you have a small family?',
	intro: 'Small family trees can be filled out by adding additional branches with birthdates. Wedding dates can also be included.<br/><h4>You can double the number of branches on your tree by adding birthdate branches.</h4><br/>' +
		'<table style=\'text-align: center\'><tr>' +
		'<td>Small Family</td><td>Date Branches Added</td><td>Small Family with Leaves*</td><td>Small Family with dates and Leaves*</td>' +
		'</tr><tr>' +
		'<td><img class=\'imgOption\' src=\'/imgs/Option Examples/Small Family.jpg\'/></td>' +
		'<td><img class=\'imgOption\' src=\'/imgs/Option Examples/Small Family With Dates.jpg\'/></td>' +
		'<td><img class=\'imgOption\' src=\'/imgs/Option Examples/Small Family With Leaves.jpg\'/></td>' +
		'<td><img class=\'imgOption\' src=\'/imgs/Option Examples/Small Family With Dates and Leaves.jpg\'/></td>' +
		'</tr><tr><td colspan=\'2\'></td><td colspan=\'2\'>*Leaves can be added in a later step.</p></td></table><br/>',
	prereq: {
		option: 'generations',
		value: ['ancestry_4gen', 'descendant_2gen', 'descendant_3gen'],
		or: {
			option: 'generations',
			value: ['ancestry_5gen'],
			and: {
				option: 'ancType',
				value: ['ancestry_individual']
			},
			or: {
				option: 'generations',
				value: ['ancestry_3gen'],
				and: {
					option: 'ancType',
					value: ['ancestry_couple']
				}
			}
		}
	},
	options: [
		{
			name: '<h3>Do you want to add date branches?</h3>',
			id: 'addDateBranches',
			type: 'button',
			buttons: [
				{
					displayText: 'Yes',
					key: 'yes'
				},
				{
					displayText: 'No',
					default: true
				}
			]
		},
		{
			prereq: {
				option: 'addDateBranches',
				value: ['yes']
			},
			required: true,
			name: 'Approximately how many people will be in your tree?&nbsp;&nbsp;',
			type: 'dropdown',
			id: 'branchesAmount',
			items: [
				{
					displayText: '0-20 (Free!)',
					cost: 0,
					summaryText: '0-20 Date Branches',
					formDisplay: '0-20 Branches'
				},
				{
					displayText: '20-30 (+$5)',
					cost: 0,
					summaryText: '20-30 Date Branches',
					formDisplay: '20-30 Branches'
				},
				{
					displayText: '30-40 (+$10)',
					cost: 0,
					summaryText: '30-40 Date Branches',
					formDisplay: '30-40 Branches'
				},
				{
					displayText: '40-50 (+$20)',
					cost: 0,
					summaryText: '40-50 Date Branches',
					formDisplay: '40-50 Branches'
				},
				{
					displayText: '50-70 (+$30)',
					cost: 0,
					summaryText: '50-70 Date Branches',
					formDisplay: '50-70 Branches'
				},
				{
					displayText: '70+ (Contact Us for a Quote)',
					cost: 0,
					summaryText: '70+ Date Branches',
					formDisplay: '70+ Branches'
				}
			]
		}
	]
}));
/** Page 5 **/
config.addPage(new TreeArtPage({
	title: 'Which style of branches do you prefer?',
	intro: '',
	options: [
		{
			name: '',
			type: 'image',
			id: 'style',
			layer: 2,
			images: [
				{
					displayText: 'Style 1',
					img: {
						style1: 'Style 1'
					},
					default: true
				},
				{
					displayText: 'Style 2',
					img: {
						style1: 'Style 2'
					}
				}
			]
		}
	]
}));
/** Page 6 **/
config.addPage(new TreeArtPage({
	//Page 6
	title: 'Which style of tree do you prefer?',
	intro: 'Need help deciding? Check out more examples <a target=\'_blank\' href=\'http://customfamilytreeart.com/gallery\'>here.</a>',
	options: [
		{
			name: '',
			type: 'image',
			id: 'style2',
			layer: 2,
			images: [
				{
					displayText: 'Classic',
					background: 'url(\'/imgs/Backgrounds/Tan 1.jpg\')',
					default: true,
					key: 'classic',
					img: {
						color: 'reset',
						chalk: 'reset',
						roots: {
							color: 'reset'
						}
					}
					// replace: [
					// 	{
					// 		id: 'imgLayer2', //Tree layer
					// 		value: ['brown', 'white'],
					// 		what: 'black'
					// 	},
					// 	{
					// 		id: 'imgLayer3', //Root layer
					// 		value: ['brown', 'white'],
					// 		what: 'black'
					// 	}
					// ],
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'black'
					// 	}
					// ],
					// removeClass: {
					// 	id: ['familyWrapper', 'quoteText', 'groundText'],
					// 	value: ['white', 'brown']
					// },
					// reset: ['background', 'leaves', 'fontColor']
				},
				{
					displayText: 'Chalk',
					key: 'chalk',
					background: 'url(\'/imgs/Backgrounds/Chalk 1.jpg\')',
					img: {
						color: 'CHALK',
						chalk: ' CHALK',
						roots: {
							color: 'CHALK'
						}
					}
					// addClass: [
					// 	{
					// 		id: ['item-builder'],
					// 		value: 'dark'
					// 	},
					// 	{
					// 		id: ['quoteText', 'familyWrapper', 'groundText'],
					// 		value: 'chalk'
					// 	}
					// ],
					// removeClass: {
					// 	id: ['familyWrapper'],
					// 	value: ['script']
					// },
					// reset: ['background', 'leaves']
				}
			]
		}
	]
}));
/** Page 7 **/
config.addPage(new TreeArtPage({
	title: 'Which background do you want?',
	intro: '',
	options: [
		{
			name: '',
			type: 'image',
			id: 'background',
			layer: 1,
			images: [
				{
					prereq: {
						option: 'type',
						value: ['ancestry', 'descendant'],
						and: {
							option: 'style2',
							value: ['classic']
						}
					},
					displayText: 'Sky & Ground',
					displayImage: '/imgs/Backgrounds/Sky & Ground No Roots.jpg',
					key: 's&g'
				},
				{
					prereq: {
						option: 'type',
						value: ['ancestry_roots', 'descendant_roots'],
						and: {
							option: 'style2',
							value: ['classic']
						}
					},
					displayText: 'Sky & Ground',
					displayImage: '/imgs/Backgrounds/Sky & Ground w Roots.jpg',
					key: 's&g'
				},
				{
					prereq: {
						option: 'type',
						value: ['ancestry', 'descendant'],
						and: {
							option: 'style2',
							value: ['classic']
						}
					},
					displayText: 'Sky & Ground 2',
					displayImage: '/imgs/Backgrounds/Sky & Ground No Roots 2.jpg',
					key: 's&g2'
				},
				{
					prereq: {
						option: 'type',
						value: ['ancestry_roots', 'descendant_roots'],
						and: {
							option: 'style2',
							value: ['classic']
						}
					},
					displayText: 'Sky & Ground 2',
					displayImage: '/imgs/Backgrounds/Sky & Ground w Roots 2.jpg',
					key: 's&g2'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Sky Blue 1',
					displayImage: '/imgs/Backgrounds/Sky Blue 1.jpg',
					key: 'sky_blue 1'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Sky Blue 2',
					displayImage: '/imgs/Backgrounds/Sky Blue 2.jpg',
					key: 'sky_blue 2'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 1',
					displayImage: '/imgs/Backgrounds/Tan 1.jpg',
					key: 't1'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 2',
					displayImage: '/imgs/Backgrounds/Tan 2.jpg',
					key: 't2'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 3',
					displayImage: '/imgs/Backgrounds/Tan 3.jpg',
					key: 't3'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 4',
					displayImage: '/imgs/Backgrounds/Tan 4.jpg',
					key: 't4'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 5',
					displayImage: '/imgs/Backgrounds/Tan 5.jpg',
					key: 't5'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 6',
					displayImage: '/imgs/Backgrounds/Tan 6.jpg',
					key: 't6'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 7',
					displayImage: '/imgs/Backgrounds/Tan 7.jpg',
					key: 't7'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 8',
					displayImage: '/imgs/Backgrounds/Tan 8.jpg',
					key: 't8'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Tan 9',
					displayImage: '/imgs/Backgrounds/Tan 9.jpg',
					key: 't9'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Kraft Paper',
					displayImage: '/imgs/Backgrounds/Kraft Paper.jpg',
					key: 'Kraft'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Brown 1',
					displayImage: '/imgs/Backgrounds/Brown 1.jpg',
					key: 'brown1',
					img: {
						color: 'white',
						roots: {
							color: 'white'
						}
					}
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'white'
					// 	}
					// ],
					// removeClass: {
					// 	id: ['familyWrapper', 'quoteText', 'groundText'],
					// 	value: ['black', 'brown']
					// },
					// constant: true,
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Brown 2',
					displayImage: '/imgs/Backgrounds/Brown 2.jpg',
					key: 'brown2',
					img: {
						color: 'white',
						roots: {
							color: 'white'
						}
					}
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'white'
					// 	}
					// ],
					// removeClass: {
					// 	id: ['familyWrapper', 'quoteText', 'groundText'],
					// 	value: ['black', 'brown']
					// },
					// constant: true,
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Gray',
					displayImage: '/imgs/Backgrounds/Gray.jpg',
					key: 'gray'
					// thumb: ''
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Green 1',
					displayImage: '/imgs/Backgrounds/Green 1.jpg',
					key: 'green1'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Green 2',
					displayImage: '/imgs/Backgrounds/Green 2.jpg',
					key: 'green2'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Green-Blue',
					displayImage: '/imgs/Backgrounds/Green-Blue.jpg',
					key: 'greenblue'
				},
				{
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					displayText: 'Red',
					displayImage: '/imgs/Backgrounds/Red.jpg',
					key: 'red',
					img: {
						color: 'white',
						roots: {
							color: 'white'
						}
					}
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'white'
					// 	}
					// ],
					// removeClass: {
					// 	id: ['familyWrapper', 'quoteText', 'groundText'],
					// 	value: ['black', 'brown']
					// },
					// constant: true,
				},
				{
					displayText: 'Black',
					displayImage: '/imgs/Backgrounds/Black.jpg',
					key: 'black',
					prereq: {
						option: 'style2',
						value: ['classic']
					},
					img: {
						color: 'white',
						roots: {
							color: 'white'
						}
					}
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'white'
					// 	}
					// ],
					// removeClass: {
					// 	id: ['familyWrapper', 'quoteText', 'groundText'],
					// 	value: ['black', 'brown']
					// },
					// constant: true,
				},
				{
					prereq: {
						option: 'style2',
						value: ['chalk']
					},
					displayText: 'Black',
					displayImage: '/imgs/Backgrounds/Black.jpg',
					key: 'black'
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'white'
					// 	}
					// ],
					// removeClass: {
					// 	id: ['familyWrapper', 'quoteText', 'groundText'],
					// 	value: ['black', 'brown']
					// },
				},
				{
					prereq: {
						option: 'style2',
						value: ['chalk']
					},
					displayText: 'Chalkboard 1',
					displayImage: '/imgs/Backgrounds/Chalk 1.jpg',
					key: 'chalk1'
				},
				{
					prereq: {
						option: 'style2',
						value: ['chalk']
					},
					displayText: 'Chalkboard 2',
					displayImage: '/imgs/Backgrounds/Chalk 2.jpg',
					key: 'chalk2'
				},
				{
					prereq: {
						option: 'style2',
						value: ['chalk']
					},
					displayText: 'Chalkboard 3',
					displayImage: '/imgs/Backgrounds/Chalk 3.jpg',
					key: 'chalk3'
				}
			],
			required: true
		}
	]
}));
/** Page 8 **/
config.addPage(new TreeArtPage({
	//Page 8
	title: 'Select a font color',
	intro: '',
	prereq: {
		option: 'style2',
		value: ['classic'],
		and: {
			option: 'background',
			not_value: [
				'brown1', 'brown2', 'red', 'black'
			]
		}
	},
	options: [
		{
			name: '',
			type: 'button',
			id: 'fontColor',
			required: true,
			buttons: [
				{
					displayText: 'Black',
					default: true,
					img: {
						color: 'black',
						roots: {
							color: 'black'
						}
					}
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'black'
					// 	}
					// ]
				},
				{
					displayText: 'Brown',
					prereq: {
						option: 'background',
						not_value: [
							'brown1', 'brown2', 'gray',
							'red', 'green2'
						]
					},
					img: {
						color: 'brown',
						roots: {
							color: 'brown'
						}
					}
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'brown'
					// 	}
					// ]
				},
				{
					displayText: 'White',
					prereq: {
						option: 'background',
						not_value: [
							's&g', 's&g2', 't1', 't2',
							'sky_blue 1', 'sky_blue 2'
						]
					},
					img: {
						color: 'white',
						roots: {
							color: 'white'
						}
					}
					// addClass: [
					// 	{
					// 		id: ['familyWrapper', 'quoteText', 'groundText'],
					// 		value: 'white'
					// 	}
					// ]
				}
			]
		}
	]
}));
/** Page 9 **/
config.addPage(new TreeArtPage({
	//Page 9
	title: 'Do you want leaves on your tree?',
	intro: '',
	options: [
		{
			name: '',
			type: 'button',
			id: 'leaves',
			layer: 4,
			buttons: [
				{
					displayText: 'Yes ($10)',
					summaryText: 'Add Leaves',
					cost: 0,
					// match_class: 'generations',
					img: {
						use: 'leaves'
					}
				},
				{
					displayText: 'No'
					// src: 'reset'
				}
			],
			required: true
		}
	]
}));
/** Page 10 **/
config.addPage(new TreeArtPage({
	//Page 10
	title: 'Do you want to add additional text?',
	intro: '*Optional text can be added to make your tree just the way you want it.<br/><br>',
	footer: '',
	options: [
		{
			name: '<strong>Family Name:</strong>&nbsp;&nbsp;',
			type: 'text',
			id: 'familyName',
			// update: 'familyText',
			placeholder: 'ex:The Jones Family'
			// properties: [
			//     ["rows", 2]
			// ]
		},
		{
			name: '<strong>Established:</strong> ',
			type: 'text',
			id: 'lineTwo',
			// update: 'lineTwo',
			placeholder: 'Established 1970'
		},
		{
			name: 'Family Name Font:&nbsp;&nbsp;',
			prereq: {
				option: 'style2',
				value: ['classic']
			},
			type: 'dropdown',
			id: 'familyFont',
			items: [
				{
					default: true,
					displayText: 'Scriptina + Monotype Corsiva',
					setFont: {
						id: 'familyWrapper',
						value: 'MType'
					},
					addClass: [
						{
							id: ['familyWrapper'],
							value: 'script'
						}
					]
				},
				{
					displayText: 'Monotype Corsiva',
					setFont: {
						id: 'familyWrapper',
						value: 'MType'
					}
				},
				{
					displayText: 'Amazone',
					setFont: {
						id: 'familyWrapper',
						value: 'Amaze'
					}
				},
				{
					displayText: 'Papyrus',
					setFont: {
						id: 'familyWrapper',
						value: 'Papyrus',
						size: '0.8vw' //Default font size is 1.1vw
					}
				}
			]
		},
		{
			name: 'Family Name Location',
			type: 'button',
			id: 'nameLoc',
			buttons: [
				{
					displayText: 'Left',
					addClass: [{
						id: ['familyWrapper'],
						value: 'left'
					}],
					disable: {
						option: {
							id: 'quoteLoc',
							value: 0
						}
					},
					default: true
				},
				{
					displayText: 'Right',
					addClass: [{
						id: ['familyWrapper'],
						value: 'right'
					}],
					disable: {
						option: {
							id: 'quoteLoc',
							value: 1
						}
					}
				},
				{
					displayText: 'Center',
					prereq: {
						option: 'type',
						value: ['ancestry', 'descendant']
					}
					// addClass: [
					// 	{
					// 		id: ['familyWrapper'],
					// 		value: 'center'
					// 	},
					// 	{
					// 		id: ['imgLayer2'],
					// 		value: 'shrinkCenter'
					// 	},
					// 	{
					// 		id: ['imgLayer4'],
					// 		value: 'shrinkCenter'
					// 	}
					// ],
					// disable: {
					// 	id: ['ground']
					// }
				}
			]
		},
		{
			name: '<br><strong>Quote or Saying:  </strong> &nbsp;&nbsp;' +
				'</tr><tr><td colspan=\'2\'></td><td colspan=\'2\'>Need some quote ideas? Click <a target=\'_blank\' href=\'http://customfamilytreeart.com/quotes\'>here</a>',
			type: 'text',
			id: 'quote',
			update: 'quoteText',
			placeholder: 'Place a quote or saying here.'
		},
		{
			name: 'Quote Font: &nbsp;&nbsp; ',
			prereq: {
				option: 'style2',
				value: ['classic']
			},
			type: 'dropdown',
			id: 'quoteFont',
			items: [
				{
					displayText: 'Monotype Corsiva',
					setFont: {
						id: 'quoteText',
						value: 'MType'
					},
					default: true
				},
				{
					displayText: 'Amazone',
					setFont: {
						id: 'quoteText',
						value: 'Amaze'
					}
				},
				{
					displayText: 'Papyrus',
					setFont: {
						id: 'quoteText',
						value: 'Papyrus',
						size: '1vw' //Default font size is 1.1vw
					}
				}
			]
		},
		{
			name: 'Quote Location',
			type: 'button',
			id: 'quoteLoc',
			buttons: [
				{
					displayText: 'Left'
					// addClass: [{
					// 	id: ['quoteText'],
					// 	value: 'left'
					// }],
					// disable: {
					// 	option: {
					// 		id: 'nameLoc',
					// 		value: 0
					// 	}
					// }
				},
				{
					displayText: 'Right',
					// addClass: [{
					// 	id: ['quoteText'],
					// 	value: 'right'
					// }],
					default: true
					// disable: {
					// 	option: {
					// 		id: 'nameLoc',
					// 		value: 1
					// 	}
					// }
				}
			]
		},
		{
			prereq: {
				option: 'type',
				value: ['ancestry_roots', 'descendant_roots']
			},
			required: true,
			name: '<br><strong>Ground Text: </strong> &nbsp;&nbsp;',
			type: 'text',
			id: 'ground',
			update: 'groundText',
			placeholder: 'Add a quote or saying here',
			disable: {
				id: ['center'],
				option: {
					id: 'nameLoc',
					value: 2
				}
			}
		},
		{
			prereq: {
				option: 'type',
				value: ['ancestry', 'descendant']
			},
			name: '<br><strong>Ground Text: </strong> &nbsp;&nbsp;',
			type: 'text',
			id: 'ground',
			update: 'groundText',
			placeholder: 'Add a quote or saying here',
			disable: {
				id: ['center'],
				option: {
					id: 'nameLoc',
					value: 2
				}
			}
		},
		{
			name: 'Ground Font: &nbsp;&nbsp; ',
			prereq: {
				option: 'style2',
				value: ['classic']
			},
			type: 'dropdown',
			id: 'groundFont',
			items: [
				{
					displayText: 'Monotype Corsiva',
					setFont: {
						id: 'groundText',
						value: 'MType'
					},
					default: true
				},
				{
					displayText: 'Amazone',
					setFont: {
						id: 'groundText',
						value: 'Amaze'
					}
				},
				{
					displayText: 'Papyrus',
					setFont: {
						id: 'groundText',
						value: 'Papyrus'//,
						// size: "0.9vw"
					}
				}
			]
		}
	]
}));
/** Page 11 **/
config.addPage(new TreeArtPage({
	//Page 11
	title: 'Do you want a Double Trunk?',
	prereq: {
		option: 'ancType',
		value: ['ancestry_couple'],
		or: {
			option: 'type',
			value: ['descendant', 'descendant_roots']
		}
	},
	intro: `
			Double trunks usually work best with 2 people. Birthdates are added after each name to get the needed length.<br><br>
			<img src='/imgs/Option Examples/Double Trunk Examples.jpg' class='full-width'/><br>
			The image of the example tree you've been building won't change based on your selection, but we will create your tree with a double trunk if you select "Yes" here.
			`,
	options: [
		{
			name: '',
			id: 'doubleTrunk',
			type: 'button',
			buttons: [
				{
					displayText: 'Yes',
					summaryText: 'Double Trunk: Yes'
				},
				{
					displayText: 'No',
					default: true
				}
			]
		}
	]
}));
/** Page 12 **/
config.addPage(new TreeArtPage({
	//Page 12
	title: 'What kind of print would you like?',
	intro: '<b>If you are outside the CONTINENTAL U.S. please select the Digital Copy option. Shipping costs are too high to ship prints internationally.</b><br/>' +
		'With the digital JPG file you will be able to have your tree printed locally as many times as you want.<br/>' +
		'<br/><b>Learn more about each print type <a target=\'_blank\' href=\'http://customfamilytreeart.com/prints\'>here</a></b><br/>',
	multiselect: true,
	// intro: "Please select at least one.",
	options: [
		{
			name: '',
			id: 'printType',
			type: 'image',
			required: true,
			images: [
				{
					displayText: '<b>Standard Print</b>',
					displayImage: '/imgs/Products/Standard Print.jpg',
					key: 'standard',
					summaryText: 'Print Type: Standard'
					// reset: ['texture']
				},
				{
					displayText: '<b>Mounted & Textured Print</b>',
					displayImage: '/imgs/Products/M&T Print.jpg',
					key: 'm&t',
					summaryText: 'Print Type: Mounted & Textured'
					// reset: ['texture']
				},
				{
					displayText: '<b>1.25" Gallery Wrapped Canvas</b>',
					displayImage: '/imgs/Products/Gallery Wrapped Canvas.jpg',
					key: 'canvas',
					summaryText: 'Print Type: Canvas'
					// reset: ['texture', 'Frame']
				},
				{
					displayText: '<b>Full Resolution Digital File ($60)</b>',
					displayImage: '/imgs/Products/Digital Copy.png',
					cost: 0,
					key: 'digital',
					summaryText: 'Digital Copy'
					// hide: [
					// 	{
					// 		id: ['printSize']
					// 	}
					// ],
					// reset: ['extraDigital', 'printSize'],
					// reset: ['texture']
				}
			]
		},
		{
			name: '<h3>Which texture do you prefer?</h3>',
			id: 'texture',
			type: 'image',
			required: true,
			prereq: {
				option: 'printType',
				value: ['m&t']
			},
			images: [
				{
					displayText: 'Linen Texture',
					displayImage: '/imgs/Option Examples/Linen Texture.jpg',
					summaryText: 'Texture: Linen'
				},
				{
					displayText: 'Canvas Texture',
					displayImage: '/imgs/Option Examples/Canvas Texture.jpg',
					summaryText: 'Texture: Canvas'
				}
			]
		},
		{
			name: '<h3>What size print would you like?</h3>',
			id: 'printSize',
			type: 'button',
			flexCount: 5,
			required: true,
			// default: true,
			prereq: {
				option: 'printType',
				value: ['standard', 'm&t', 'canvas']
			},
			buttons: [
				//Standard print
				{
					// TODO Work out these placeholder things
					displayText: '8x10 &nbsp;(%value%)',
					placeholder: '8x10',
					key: '8x10',
					values: [
						{
							option: 'printType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'printType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'printType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					],
					summaryText: 'Print Size: 8x10'
				},
				{
					displayText: '11x14 (%value%)',
					placeholder: '11x14',
					key: '11x14',
					values: [
						{
							option: 'printType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'printType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'printType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					],
					summaryText: 'Print Size: 11x14'
				},
				{
					displayText: '16x20 (%value%)',
					placeholder: '16x20',
					key: '16x20',
					values: [
						{
							option: 'printType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'printType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'printType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					],
					summaryText: 'Print Size: 16x20'
				},
				{
					displayText: '20x24 (%value%)',
					placeholder: '20x24',
					key: '20x24',
					values: [
						{
							option: 'printType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'printType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'printType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					],
					summaryText: 'Print Size: 20x24'
				},
				{
					displayText: '24x30 (%value%)',
					placeholder: '24x30',
					key: '24x30',
					values: [
						{
							option: 'printType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'printType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'printType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					],
					summaryText: 'Print Size: 24x30'
				}
			]
		},
		{
			name: `<h3>Would you like a digital copy in addition to your print?</h3>`,
			id: 'extraDigital',
			type: 'button',
			prereq: {
				option: 'printType',
				value: ['standard', 'm&t', 'canvas']
			},
			buttons: [
				{
					displayText: 'Yes ($39)',
					cost: 0,
					summaryText: 'Extra Digital Copy'
				},
				{
					displayText: 'No',
					summaryText: 'No Digital Copy'
				}
			]
		}
	]
}));
/** Page 13 **/
config.addPage(new TreeArtPage({
	//Page 13       Don't show if they selected JPG
	title: 'Do you want a frame for your tree?',
	intro: '<b>Learn more about frames <a target=\'_blank\' href=\'http://customfamilytreeart.com/frames\'>here</a></b>',
	prereq: {
		option: 'printType',
		// value: ["print", "both"]
		value: ['standard', 'm&t']
	},
	options: [
		{
			name: '',
			id: 'Frame',
			type: 'image',
			flexCount: 3,
			images: [
				{
					displayText: 'None',
					default: true,
					displayImage: '/imgs/Products/No Frame.jpg'
				},
				{
					displayText: 'Natural Barnwood ~ 2.25" (%value%)',
					placeholder: 'Natural Barnwood ~ 2.25"',
					displayImage: '/imgs/Products/Natural Barnwood Corner.jpg',
					summaryText: 'Natural Barnwood Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Whitewashed Barnwood ~ 2.25" (%value%)',
					placeholder: 'Whitewashed Barnwood ~ 2.25"',
					displayImage: '/imgs/Products/Whitewashed Barnwood Corner.jpg',
					summaryText: 'Whitewashed Barnwood Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Flat Black Wood ~ 1.125" (%value%)',
					placeholder: 'Flat Black Wood ~ 1.125"',
					displayImage: '/imgs/Products/Flat Black Corner.jpg',
					summaryText: 'Flat Black Wood Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Flat White Wood ~ 1.125" (%value%)',
					placeholder: 'Flat White Wood ~ 1.125"',
					displayImage: '/imgs/Products/Flat White Corner.jpg',
					summaryText: 'Flat White Wood Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Mocha Wood ~ 1.125" (%value%)',
					placeholder: 'Mocha Wood ~ 1.125"',
					displayImage: '/imgs/Products/Mocha Corner.jpg',
					summaryText: 'Mocha Wood Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Natural Basswood ~ 1.125" (%value%)',
					placeholder: 'Natural Basswood ~ 1.125"',
					displayImage: '/imgs/Products/Natural Basswood Corner.jpg',
					summaryText: 'Natural Basswood Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Classic Black ~ 1.625" (%value%)',
					placeholder: 'Classic Black ~ 1.625"',
					displayImage: '/imgs/Products/Black Americana Corner.jpg',
					summaryText: 'Classic Black Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Black & Silver Scoop ~ 1.75" (%value%)',
					placeholder: 'Black & Silver Scoop ~ 1.75"',
					displayImage: '/imgs/Products/Black & Silver Scoop Corner.jpg',
					summaryText: 'Black & Silver Scoop Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Black Scoop ~ 2" (%value%)',
					placeholder: 'Black Scoop ~ 2"',
					displayImage: '/imgs/Products/Black Scoop Corner.jpg',
					summaryText: 'Black Scoop Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Gold Scoop ~ 2" (%value%)',
					placeholder: 'Gold Scoop ~ 2"',
					displayImage: '/imgs/Products/Gold Scoop Corner.jpg',
					summaryText: 'Gold Scoop Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				},
				{
					displayText: 'Pewter Scoop ~ 2"" (%value%)',
					placeholder: 'Pewter Scoop ~ 2"',
					displayImage: '/imgs/Products/Pewter Scoop Corner.jpg',
					summaryText: 'Pewter Scoop Frame',
					values: [
						{
							option: 'printSize',
							value: ['8x10'], //8x10
							cost: 0
						},
						{
							option: 'printSize',
							value: ['11x14'], //11x14
							cost: 0
						},
						{
							option: 'printSize',
							value: ['16x20'], //16x20
							cost: 0
						},
						{
							option: 'printSize',
							value: ['20x24'], //20x24
							cost: 0
						},
						{
							option: 'printSize',
							value: ['24x30'], //24x30
							cost: 0
						}
					]
				}
			]
		}
	]
}));
/** Page 14 **/
config.addPage(new TreeArtPage({
	//Page 14
	title: 'Do you want any additional prints?',
	intro: '',
	prereq: {
		option: 'printType',
		// value: ["print", "both"]
		value: ['standard', 'm&t', 'canvas']
	},
	multiselect: {
		id: 'additionalPrints',
		keys: ['addPrintType', 'addPrintSize', 'addQty'],
		quantifier: 'addQty',
		format: '%addQty%x %addPrintType% - %addPrintSize%',
		formula: '%addQty% * %total%'
	},
	options: [
		{
			name: '',
			id: 'addPrintType',
			type: 'image',
			// total: false,
			images: [
				{
					displayText: 'Standard Print',
					displayImage: '/imgs/Products/Standard Print.jpg',
					key: 'standard'
				},
				{
					displayText: 'Mounted & Textured Print',
					displayImage: '/imgs/Products/M&T Print.jpg',
					key: 'm&t'
				},
				{
					displayText: '1 1/2" Gallery Wrapped Canvas',
					displayImage: '/imgs/Products/Gallery Wrapped Canvas.jpg',
					key: 'canvas'
				}
			]
		},
		{
			name: '<h3>What size print would you like?</h3>',
			id: 'addPrintSize',
			type: 'button',
			flexCount: 5,
			// total: false,
			prereq: {
				option: 'addPrintType',
				value: ['standard', 'm&t', 'canvas']
			},
			buttons: [
				{
					displayText: '&nbsp; 8x10 &nbsp;(%value%)',
					placeholder: '8x10',
					key: '8x10',
					values: [
						{
							option: 'addPrintType',
							value: ['standard'], //Std
							cost: 1
						},
						{
							option: 'addPrintType',
							value: ['m&t'], //M&T
							cost: 1
						},
						{
							option: 'addPrintType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					]
				},
				{
					displayText: '11x14 (%value%)',
					placeholder: '11x14',
					key: '11x14',
					values: [
						{
							option: 'addPrintType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'addPrintType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'addPrintType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					]
				},
				{
					displayText: '16x20 (%value%)',
					placeholder: '16x20',
					key: '16x20',
					values: [
						{
							option: 'addPrintType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'addPrintType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'addPrintType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					]
				},
				{
					displayText: '20x24 (%value%)',
					placeholder: '20x24',
					key: '20x24',
					values: [
						{
							option: 'addPrintType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'addPrintType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'addPrintType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					]
				},
				{
					displayText: '24x30 (%value%)',
					placeholder: '24x30',
					key: '24x30',
					values: [
						{
							option: 'addPrintType',
							value: ['standard'], //Std
							cost: 0
						},
						{
							option: 'addPrintType',
							value: ['m&t'], //M&T
							cost: 0
						},
						{
							option: 'addPrintType',
							value: ['canvas'], //Canvas
							cost: 0
						}
					]
				}
			]
		},
		{
			name: 'Quantity',
			id: 'addQty',
			// total: false,
			prereq: {
				option: 'addPrintSize',
				value: ['8x10', '11x14', '16x20', '20x24', '24x30']
			},
			type: 'number'
		}
	]
}));
/** Page 15 **/
config.addPage(new TreeArtPage({
	//Page 15
	title: 'Do you want your tree by a certain date? We\'ll do our best!',
	intro: '<b>Find out more about turnaround and shipping times <a target=\'_blank\' href=\'http://customfamilytreeart.com/shipping\'>here</a></b>',
	options: [
		{
			display: 'Request Date: ',
			name: '',
			id: 'requestDate',
			type: 'date'
		},
		{
			name: '<h3>Do you have any other comments or questions?</h3>',
			display: 'Additional Comments: ',
			id: 'comments',
			type: 'textLong',
			placeholder: 'Enter any other comments/requests here.'
		}
	]
}));
/** Page 16 **/
config.addPage(new TreeArtPage({
	//Page 16 - Shipping!
	title: 'How do you want your products shipped?',
	intro: '<b>These shipping options are for the CONTINENTAL U.S. only.</b><br/>' +
		'Shipping costs for all other locations are too high. Please select Digital Copy only so that you can have it printed locally.<br/>' +
		'<b>Production and shipping times may be 2 to 3 times longer than normal because of labor shortages at the printing facility and shipping company. ' +
		'Please order early!</b><br/>',
	prereq: {
		option: 'printType',
		value: ['standard', 'm&t', 'canvas']
	},
	options: [
		{
			name: '',
			type: 'button',
			id: 'shipping',
			buttons: [
				{
					displayText: 'Standard Shipping  3-10 Days (%value%)',
					default: true,
					// hold: true,
					summaryText: 'Standard Shipping 3-10 Days',
					values: [
						{
							option: 'Frame',
							value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], //Basically everything but "none"
							cost: 0.99
						},
						{
							option: 'printType',
							value: ['standard', 'm&t'],
							cost: 0.99
						},
						{
							option: 'printType',
							value: ['canvas'],
							cost: 0.99
						}
					]
				},
				{
					displayText: '2 Day Shipping (%value%)',
					// hold: true,
					summaryText: '2 Day Shipping',
					values: [
						{
							option: 'Frame',
							value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], //Basically everything but "none"
							cost: 0.99
						},
						{
							option: 'printType',
							value: ['standard', 'm&t'],
							cost: 0.99
						},
						{
							option: 'printType',
							value: ['canvas'],
							cost: 0.99
						}
					]
				},
				{
					displayText: '1 Day Shipping (%value%)',
					summaryText: '1 Day Shipping',
					values: [
						{
							option: 'Frame',
							value: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], //Basically everything but "none"
							cost: 0.99
						},
						{
							option: 'printType',
							value: ['standard', 'm&t'],
							cost: 0.99
						},
						{
							option: 'printType',
							value: ['canvas'],
							cost: 0.99
						}
					]
				}
			]
		}
	]
}));
/** Final Page **/
config.addPage(new TreeArtPage({
	//Final page.
	title: 'Your order is ready to submit! Please check out below.',
	intro: `After you place your order, you will receive an email from us that will have the name form(s) you need. If you don't see it soon, check your junk folder.
					Enter your family names as directed by the form and email them to us.
					<br>If you have any questions, please send us an email at <a href='mailto:Order@customfamilytreeart.com'>Order@CustomFamilyTreeArt.com</a>`,
	options: [],
	finalPage: true
}));

export { config };