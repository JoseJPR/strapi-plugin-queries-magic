'use strict';

/**
 * QueriesMagic.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require('lodash');

module.exports = {
  search: async () => {
    // Execute function of the provider for all files.
    return {
      status: 'ok send'
    };
  }
};
