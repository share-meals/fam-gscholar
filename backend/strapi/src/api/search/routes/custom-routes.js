'use strict';

module.exports = {
    routes: [
	{
	    method: 'POST',
	    path: '/search/run',
	    handler: 'custom-controller.run',
	    config: {
		policies: []
	    }
	}
    ]
}
