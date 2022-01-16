import { INodeProperties } from "n8n-workflow";

export const additionalFieldsGlobal: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: [
					'createPic'
				],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Theme ID',
				name: 'themeId',
				type: 'string',
				default: "",
				description: 'You can use a theme instead of pass all the customization values trough the API',
			},
			{
				displayName: 'Dimension',
				name: 'dimension',
				type: 'options',
				default: '1:1',
				options:[
					{
						name:"1:1",
						value:"1:1",
						description:"for Instagram Feed"
					},
					{
						name:"9:16",
						value:"9:16",
						description:"for Instagram Stories"
					},
					{
						name:"1200:627",
						value:"1200:627",
						description:"for Linkedin"
					},
					{
						name:"1200:630",
						value:"1200:630",
						description:"for Facebook"
					},
					{
						name:"autoHeight",
						value:"autoHeight",
						description:"adjust the image height if the tweet content overflows the default 1:1 height"
					},
					{
						name:"autoSize",
						value:"autoSize",
						description:"fits the content independent of the tweet size"
					},
				],
				description: 'Change the image dimension',
			},
			{
				displayName: 'Display Likes',
				name: 'displayLikes',
				type: 'boolean',
				default: false,
				description: 'Includes the number of likes until that exactly moment',
			},
			{
				displayName: 'Display Replies',
				name: 'displayReplies',
				type: 'boolean',
				default: false,
				description: 'Includes the number of replies until that exactly moment',
			},
			{
				displayName: 'Display Retweets',
				name: 'displayRetweets',
				type: 'boolean',
				default: false,
				description: 'Includes the number of retweets until that exactly moment',
			},
			{
				displayName: 'Display Verified',
				name: 'displayVerified',
				type: 'boolean',
				default: true,
				description: 'Includes the verified badge',
			},
			{
				displayName: 'Display Source',
				name: 'displaySource',
				type: 'boolean',
				default: true,
				description: 'Includes the source of the tweet',
			},
			{
				displayName: 'Display Times',
				name: 'displayTime',
				type: 'boolean',
				default: true,
				description: 'Includes the time of the tweet',
			},
			{
				displayName: 'Display Media Images',
				name: 'displayMediaImages',
				type: 'boolean',
				default: true,
				description: 'Includes the tweet media images',
			},
			{
				displayName: 'Display Link Preview',
				name: 'displayLinkPreview',
				type: 'boolean',
				default: true,
				description: 'Includes the link preview image and info',
			},
			{
				displayName: 'Text Width',
				name: 'textWidth',
				type: 'number',
				default: '',
				placeholder:"Any number higher than zero. This value is representing a percentage",
				description: 'The horizontal width of tweet text',
			},
			{
				displayName: 'Canvas Width',
				name: 'canvasWidth',
				type: 'number',
				default: '',
				placeholder:"Any number higher than zero. This value is used in pixels(px) units",
				description: 'The horizontal width of the image',
			},
			{
				displayName: 'Background Image',
				name: 'backgroundImage',
				type: 'string',
				default: '',
				placeholder:"https://example.com/image.png",
				description: 'A image that you want to use as background. You need to use this as a valid URL like https://mysite.com/image.png and it should not be protected by CORS',
			},
		],
		description: 'Additional Field for Post Routes.',
	},
]
