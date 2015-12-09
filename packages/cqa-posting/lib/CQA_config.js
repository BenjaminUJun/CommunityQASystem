CQAPostings.config = {};

CQAPostings.config.postStatuses = [
	{
		value: 1,
		label: function(){return trans.t('pending');}
	},
	{
		value: 2,
		label: function(){return trans.t('approved');}
	},
	{
		value: 3,
		label: function(){return trans.t('rejected');}
	}
];

CQAPostings.config.STATUS_PENDING = 1;
CQAPostings.config.STATUS_APPROVED = 2;
CQAPostings.config.STATUS_REJECTED = 3;
