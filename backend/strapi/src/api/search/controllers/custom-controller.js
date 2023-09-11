'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { getJson } = require('serpapi');


module.exports = createCoreController('api::search.search', ({strapi}) => ({
    async run(ctx){
	/*
	const response = getJson({
	    engine: 'google_scholar',
	    api_key: process.env.SERPAPI_KEY 
	});
	*/
	console.log(ctx.request.body);

	
	return this.transformResponse({});
    }
}));
