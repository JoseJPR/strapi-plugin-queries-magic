'use strict';

/**
 * QueriesMagic.js controller
 *
 * @description: any
 */

const _ = require('lodash');
const { Utils } = require('../utils/utils');

module.exports = {
  search: async (mainCollection, ctx) => {

        //We create _filters to create the filter of unrelated collections
        const _filters = {};
        //We create _queries to create the search filters for each collection and obtain _id
        const _queries = {};
        //We create _filtersIds to save all the filters grouped by collection and adding $ in for the search by ids
        const _filtersIds = {};
    
        for(var key in ctx.query){
          if(key.includes('.')){
            //We create the object if it does not exist with the name of the collection
            if(!_queries[key.split('.')[0]]){
              _queries[key.split('.')[0]] = {};
            }
            //We add the filter to the collection that corresponds to the value
            _queries[key.split('.')[0]][key.split('.')[1]] = ctx.query[key];
          }else{
            //We add the filter to the main collection
            _filters[key] = ctx.query[key];
          }
        }
    
        for(var _filterQuery in _queries){
          //We call the service in a dynamic way according to the saved items for each collection
          _filtersIds[_filterQuery] = await strapi.services[_filterQuery].fetchAll(_queries[_filterQuery]);
          //We get only the _id and add the query with $ in and the _id
          var settingsPatch = path.join(__dirname, '../../api/' + mainCollection + '/models/' + mainCollection.Utils.capitalize()+ '.settings.json');
          var JSONPatch = JSON.parse(fs.readFileSync(settingsPatch, 'utf8'));
          if(JSONPatch.attributes[_filterQuery].collection != undefined){
            _filters[_filterQuery] = {$elemMatch: {$in: _filtersIds[_filterQuery].map(x => x._id)}};
          }else{
            _filters[_filterQuery] = {$in: _filtersIds[_filterQuery].map(x => x._id)};
          }
        }
    
        return strapi.services[mainCollection].fetchAll(_filters);

  }
};
