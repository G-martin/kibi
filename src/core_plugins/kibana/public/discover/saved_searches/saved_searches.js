import 'plugins/kibana/discover/saved_searches/_saved_search';
import 'ui/notify';
// kibi: import needed to prevent crash when plugins loaded
import 'ui/courier';
// kibi: end
import { uiModules } from 'ui/modules';
import { SavedObjectLoader } from 'ui/courier/saved_object/saved_object_loader';
import { CacheProvider } from 'ui/kibi/helpers/cache_helper';
import { savedObjectManagementRegistry } from 'plugins/kibana/management/saved_object_registry';

const module = uiModules.get('discover/saved_searches', [
  'kibana/notify'
]);

// Register this service with the saved object registry so it can be
// edited by the object editor.
savedObjectManagementRegistry.register({
  service: 'savedSearches',
  title: 'searches'
});

// kibi: Private and savedObjectsAPI is added
module.service('savedSearches', function (kbnIndex, esAdmin, SavedSearch, kbnUrl, Private, savedObjectsAPI) {
  const options = {
    caching: {
      find: true,
      get: true,
      cache: Private(CacheProvider)
    },
    savedObjectsAPI
  };
  const savedSearchLoader = new SavedObjectLoader(SavedSearch, kbnIndex, esAdmin, kbnUrl, options);
  // Customize loader properties since adding an 's' on type doesn't work for type 'search' .
  savedSearchLoader.loaderProperties = {
    name: 'searches',
    noun: 'Saved Search',
    nouns: 'saved searches'
  };
  savedSearchLoader.urlFor = function (id) {
    return kbnUrl.eval('#/discover/{{id}}', { id: id });
  };

  return savedSearchLoader;
});
