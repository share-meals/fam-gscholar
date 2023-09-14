'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { getJson } = require('serpapi');


module.exports = createCoreController('api::search.search', ({strapi}) => ({
    async run(ctx){
	const response = await getJson(ctx.request.body);
	return this.transformResponse(response);
    }
}));
