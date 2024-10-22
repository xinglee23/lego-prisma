// // create activity give default params
// export const getDefaultParams = () => ({
// 	user_name: 'admin',
// 	user_cname: '实时管理员',
// 	activity: {
// 		name: '活跃有礼',
// 		activity_show_name: '活跃有礼',
// 		type: 'ACTIVITY_COMBO',
// 		source: 'SENSORS_ACTIVITY',
// 		work_status: 'ACTIVITY_END',
// 		url: 'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/activity/965813693898055680.html',
// 		second_work_status: '',
// 		template_config: {
// 			name: '抽奖次数 1 次'
// 		},
// 		validated: true,
// 		setting_config: {
// 			activity_start_time: '2023-07-03 00:00:00',
// 			activity_end_time: '2023-07-03 23:59:59',
// 			activity_param_config: [
// 				{
// 					component_instance_id: 'i4ff1361U3GiYJfKTycSQd',
// 					component_code: 'SINGLE_RECEIVE',
// 					component_name: '每周签到',
// 					status: 1,
// 					reset_cycle_switch: true,
// 					reset_cycle_config: 'WEEK',
// 					opportunity_distribute_switch: true,
// 					opportunity_distribute_user_group_config: {
// 						all_group: true,
// 						sps_group: '',
// 						realtime_group: ''
// 					},
// 					title: '花样好礼任你选',
// 					description: '可在下列奖励中任意挑选～',
// 					prize_config_list: [
// 						{
// 							order_id: 1,
// 							child_component_id: 'dyjgfbazjd5yxl8z',
// 							reward_info_id: 10091,
// 							name: '抽奖次数 1 次',
// 							title: '抽奖机会+1',
// 							description: '领取说明',
// 							add_stock: 0,
// 							stock_cycle_switch: false,
// 							stock_cycle_quantity: -1,
// 							reward_thumb_image:
// 								'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/83b7b242d4764af6b85cb147ae3f6bb8.png',
// 							commodity_type: -2,
// 							relation_component_config: {
// 								invoke_component_instance_id: 'i4ff1361U3GiYJfKTycSQd',
// 								invoke_component_code: 'SINGLE_RECEIVE',
// 								invoked_component_instance_id: 'dDU6xxuqqJJdLKzVYrQfuZ',
// 								invoked_component_code: 'LUCKY_WHEEL',
// 								invoked_ability_code: 'addLotteryChance',
// 								invoked_param: {
// 									num: 1
// 								}
// 							},
// 							cycle_start_stamp: '00 00 00 * * ?',
// 							cycle_end_stamp: '59 59 23 * * ?'
// 						}
// 					],
// 					choose_prize_limit_max: 1
// 				},
// 				{
// 					component_instance_id: 'dDU6xxuqqJJdLKzVYrQfuZ',
// 					component_code: 'LUCKY_WHEEL',
// 					component_name: '大转盘',
// 					general_config: {
// 						virtual_person_num: 0,
// 						lottery_plugin_type: '大转盘',
// 						delivery_rule_switch: false,
// 						prize_distribution_mode: 2,
// 						user_max_prize_num_switch: false,
// 						user_max_delivery_num_switch: false,
// 						all_winning_switch: false,
// 						certainly_winning_switch: false
// 					},
// 					prize_list: [
// 						{
// 							prize_id: '1675777179623669762',
// 							prize_name: '谢谢参与',
// 							commodity_type: -1,
// 							prize_order: 1,
// 							prize_thumb_image:
// 								'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/be383ae3dc694851bc7253aab41fcd9b.png?x-oss-process=image/crop,x_0,y_0,w_96,h_96',
// 							prize_description: '谢谢参与',
// 							prize_total_stock: -1,
// 							add_stock: 0,
// 							reward_info_id: -1,
// 							reward_name: '谢谢参与',
// 							user_group: {
// 								all_group: true,
// 								sps_group: '',
// 								realtime_group: ''
// 							},
// 							winning_probability: '1.0',
// 							code: ['-1']
// 						},
// 						{
// 							prize_id: '1675777179623669763',
// 							prize_name: '谢谢参与',
// 							commodity_type: -1,
// 							prize_order: 2,
// 							prize_thumb_image:
// 								'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/f992997430b944ad9249c06105bd822c.png',
// 							prize_description: '谢谢参与',
// 							prize_total_stock: -1,
// 							add_stock: 0,
// 							reward_info_id: -1,
// 							reward_name: '谢谢参与',
// 							user_group: {
// 								all_group: true,
// 								sps_group: '',
// 								realtime_group: ''
// 							},
// 							winning_probability: '0.0',
// 							code: ['-1']
// 						},
// 						{
// 							prize_id: '1675777179623669764',
// 							prize_name: '谢谢参与',
// 							commodity_type: -1,
// 							prize_order: 3,
// 							prize_thumb_image:
// 								'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/e7f657592a20454188319cfda03a3f39.png?x-oss-process=image/crop,x_0,y_0,w_81,h_81',
// 							prize_description: '谢谢参与',
// 							prize_total_stock: -1,
// 							add_stock: 0,
// 							reward_info_id: -1,
// 							reward_name: '谢谢参与',
// 							user_group: {
// 								all_group: true,
// 								sps_group: '',
// 								realtime_group: ''
// 							},
// 							winning_probability: '0.0',
// 							code: ['-1']
// 						},
// 						{
// 							prize_id: '1675777179623669765',
// 							prize_name: '谢谢参与',
// 							commodity_type: -1,
// 							prize_order: 4,
// 							prize_thumb_image:
// 								'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/b733fbc249874cc99f20c315491f9c68.png',
// 							prize_description: '谢谢参与',
// 							prize_total_stock: -1,
// 							add_stock: 0,
// 							reward_info_id: -1,
// 							reward_name: '谢谢参与',
// 							user_group: {
// 								all_group: true,
// 								sps_group: '',
// 								realtime_group: ''
// 							},
// 							winning_probability: '0.0',
// 							code: ['-1']
// 						},
// 						{
// 							prize_id: '1675777179623669766',
// 							prize_name: '谢谢参与',
// 							commodity_type: -1,
// 							prize_order: 5,
// 							prize_thumb_image:
// 								'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/8b85775fe894417eb315fbbe8f46884f.png?x-oss-process=image/crop,x_0,y_0,w_96,h_96',
// 							prize_description: '谢谢参与',
// 							prize_total_stock: -1,
// 							add_stock: 0,
// 							reward_info_id: -1,
// 							reward_name: '谢谢参与',
// 							user_group: {
// 								all_group: true,
// 								sps_group: '',
// 								realtime_group: ''
// 							},
// 							winning_probability: '0.0',
// 							code: ['-1']
// 						},
// 						{
// 							prize_id: '1675777179623669767',
// 							prize_name: '谢谢参与',
// 							commodity_type: -1,
// 							prize_order: 6,
// 							prize_thumb_image:
// 								'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/a94cacf07fc44ce589789cea53b604c8.png',
// 							prize_description: '谢谢参与',
// 							prize_total_stock: -1,
// 							add_stock: 0,
// 							reward_info_id: -1,
// 							reward_name: '谢谢参与',
// 							user_group: {
// 								all_group: true,
// 								sps_group: '',
// 								realtime_group: ''
// 							},
// 							winning_probability: '0.0',
// 							code: ['-1']
// 						},
// 						{
// 							prize_id: '1675777179623669768',
// 							prize_name: '谢谢参与',
// 							commodity_type: -1,
// 							prize_order: 7,
// 							prize_thumb_image:
// 								'https://opentest-aliyun-scms.sensorsdata.cn/sfnfresh/49907fe1d63c45abbb1d5035c3447b72.png',
// 							prize_description: '谢谢参与',
// 							prize_total_stock: -1,
// 							add_stock: 0,
// 							reward_info_id: -1,
// 							reward_name: '谢谢参与',
// 							user_group: {
// 								all_group: true,
// 								sps_group: '',
// 								realtime_group: ''
// 							},
// 							winning_probability: '0.0',
// 							code: ['-1']
// 						}
// 					]
// 				}
// 			],

// 			version: 'v1'
// 		}
// 	}
// });

export const getDefaultParams = () => {
	return {
		user_name: 'admin',
		user_cname: '实时管理员',
		activity: {
			activity_id: '667280e40a0bfe48ec9e90f6',
			name: '超级大声',
			template_config:
				'{"type":"APP","id":"6f6LEa94sbc1CRVKkzDWPi","name":"APP","posRect":{},"childList":[{"type":"TOAST","id":"1uQS3w5QdSRHSbQkwPvj4z","name":"反馈信息 1","class":"appToast","posRect":{"position":"modal"},"props":{"visible":false,"target":"","toastColor":"#fff","toastBg":"rgba(0,0,0,0.8)","duration":2000,"toastList":[{"target":"activityNotStart","title":"活动未开始提示","msg":"活动暂未开始"},{"target":"activityEnd","title":"活动已结束提示","msg":"活动已结束，谢谢参与"},{"target":"noActivityAuth","title":"非可参与用户提示","msg":"抱歉，您不满足活动参与资格"},{"target":"activityUpdated","title":"活动已更新提示","msg":"活动版本已更新，请刷新页面重试","disabledCustom":true}]}}],"slots":{"activity":{"type":"ACTIVITY_PAGE","id":"9jsK3HFhyE741UVM3wYtqS","name":"活动页 1","posRect":{"position":"page","h":726},"props":{"bgColor":"#ffffff"},"childList":[],"route":{"path":"activity"}},"warmup":{"type":"WARMUP_PAGE","id":"dCNk1C1TY1FZqn6F92iyc8","name":"预热页 1","posRect":{"position":"page","h":726},"props":{"enable":true},"childList":[{"type":"IMAGE","id":"swarnoj4o9iAmSJT6EeKbq","name":"图片 1","posRect":{"position":"absolute","x":147,"y":259,"w":80},"props":{"$img$image":{"url":"/optimus/combo-designer/plugin-compose/src/widgets/WarmupPage/assets/empty.png"}}},{"type":"TEXT","id":"kGqdF7S2bkeXUBoPBbQvUG","name":"文字 1","posRect":{"position":"absolute","x":23,"y":359,"w":328},"props":{"text":"<p style=\\"text-align: center; text-indent: 0px; margin-bottom: 0px; line-height: 1.5; letter-spacing: normal\\"><span style=\\"color: #475669\\"><span><span style=\\"font-size: 20px\\">活动暂未开始</span></span></span></p>"}}],"route":{"path":"warmup"}}}}',
			setting_config: {
				take_part_in_config: {
					user_group: '{"all_group":true,"sps_group":"","realtime_group":""}'
				},
				activity_param_config: []
			},
			share_config: {
				poster_setting_config: {
					qrcode_config: '{"w":30,"x":112,"y":390}'
				}
			},
			validated: false,
			component_list: [
				{
					component_instance_id: '9jsK3HFhyE741UVM3wYtqS',
					component_name: '活动页 1',
					component_code: 'ACTIVITY_PAGE'
				},
				{
					component_instance_id: 'dCNk1C1TY1FZqn6F92iyc8',
					component_name: '预热页 1',
					component_code: 'WARMUP_PAGE'
				},
				{
					component_instance_id: 'swarnoj4o9iAmSJT6EeKbq',
					component_name: '图片 1',
					component_code: 'IMAGE'
				},
				{
					component_instance_id: 'kGqdF7S2bkeXUBoPBbQvUG',
					component_name: '文字 1',
					component_code: 'TEXT'
				},
				{
					component_instance_id: '1uQS3w5QdSRHSbQkwPvj4z',
					component_name: '反馈信息 1',
					component_code: 'TOAST'
				},
				{
					component_instance_id: '6f6LEa94sbc1CRVKkzDWPi',
					component_name: 'APP',
					component_code: 'APP'
				}
			],
			template_info: {
				template_id: '',
				template_name: '',
				template_type: '',
				thumb_url: ''
			},
			template_id: '',
			approve: {
				remarks: '',
				activity_url: '',
				activity_detail_url: '',
				attachments: []
			}
		}
	};
};
