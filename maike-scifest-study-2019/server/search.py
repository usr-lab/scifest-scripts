import copy
import re

from widget_server.ElasticSearchQuery import ElasticSearchQuery
from widget_server.enum import CardType, ObjectAdStatus


class SearchQueryBuilder:

    def __init__(self, initial_query=None):

        if initial_query:
            self._minimal_query = initial_query
        else:
            self._minimal_query = {
                "query": {
                    "bool": {
                        "must": []
                    }
                },
                'sort': []
            }

    def copy(self):
        return SearchQueryBuilder(copy.deepcopy(self._minimal_query))

    def with_sorting(self, sorting_key, sorting_direction):
        if sorting_key not in ['rooms', 'rent', 'area', 'date_publish']:
            sorting_key = 'date_publish'

        if sorting_direction not in ['asc', 'desc']:
            sorting_direction = 'desc'

        self._minimal_query['sort'].append({sorting_key: {"order": sorting_direction}})

        return self

    def with_geolocation(self, latitude, longitude, radius='50km'):
        if latitude and longitude and (isinstance(latitude, float) or re.match('[0-9]+\.[0-9]+', latitude)) and \
                (isinstance(longitude, float) or re.match('[0-9]+\.[0-9]+', longitude)) and \
                re.match('[1-9][0-9]*km', radius):
            self._minimal_query['query']['bool']['must'].append({
                "bool": {
                    "filter": {
                        "geo_distance": {
                            "distance": radius,
                            "pin.location": {
                                "lat": latitude,
                                "lon": longitude
                            }
                        }
                    }
                }
            })
        return self

    def with_text_query(self, query):
        if query:
            self._minimal_query['query']['bool']['must'].append({
                "bool": {
                    "should": [
                        {"wildcard": {"county": "*" + query.lower() + "*"}},
                        {"wildcard": {"municipality": "*" + query.lower() + "*"}},
                        {"wildcard": {"city": "*" + query.lower() + "*"}},
                        {"wildcard": {"search_street": "*" + query.lower() + "*"}}
                    ]
                }
            })

        return self

    def with_rent(self, min_rent='min', max_rent='max'):
        fragment = self._build_range_part('rent', min_rent, max_rent)

        if fragment:
            self._minimal_query['query']['bool']['must'].append(fragment)

        return self

    def with_rooms(self, min_rooms='min', max_rooms='max'):
        fragment = self._build_range_part('rooms', min_rooms, max_rooms)

        if fragment:
            self._minimal_query['query']['bool']['must'].append(fragment)

        return self

    def with_area(self, min_area='min', max_area='max'):
        fragment = self._build_range_part('area', min_area, max_area)

        if fragment:
            self._minimal_query['query']['bool']['must'].append(fragment)

        return self

    def _build_range_part(self, field_name, _min, _max):
        query_fragment = {}

        if _min != 'min':
            query_fragment['gte'] = _min

        if _max != 'max':
            query_fragment['lte'] = _max

        if query_fragment:
            query_fragment = {"range": {field_name: query_fragment}}

        return query_fragment

    def with_boolean_flags(self, flags):
        if flags:
            self._minimal_query['query']['bool']['must'].append({
                "bool": {
                    "must": [
                        {'match': {flag: True}} for flag in flags
                    ]
                }
            })
        return self

    def with_display_only(self):
        self._minimal_query['query']['bool']['must'].append({
            "match": {
                'display': True
            }
        })

        return self

    def with_company_id(self, company_id):
        self._minimal_query['query']['bool']['must'].append({
            "match": {
                'company': company_id
            }
        })
        return self

    def with_ad_id(self, object_ad_id):
        self._minimal_query['query']['bool']['must'].append({"match": {'id': object_ad_id}})
        self._minimal_query['query']['bool']['must'].append({"match": {'card_type': CardType.SINGLE_INDIVIDUAL.value}})
        return self

    def with_single_cards(self):
        self._minimal_query['query']['bool']['must'].append({"match": {"card_type": CardType.SINGLE_INDIVIDUAL.value}})
        return self

    def with_estate_id(self, estate_id):
        self._minimal_query['query']['bool']['must'].append({"match": {"estate": estate_id}})
        return self

    def with_exclude_reserved(self):
        self._minimal_query['query']['bool']['must'].append({
            "bool": {
                "should": [
                    {
                        "bool": {
                            "must_not": [
                                {
                                    "exists": {
                                        "field": "status"
                                    }
                                }
                            ]
                        }
                    },
                    {
                        'match': {
                            'status': ObjectAdStatus.Active.value
                        }
                    },
                ]
            }
        })

        return self

    @property
    def query(self):
        return self._minimal_query

    def build(self):
        return ElasticSearchQuery('search', self._minimal_query)
