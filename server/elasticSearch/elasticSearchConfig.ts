import {Client} from '@elastic/elasticsearch'
import {IndicesCreateRequest} from '@elastic/elasticsearch/lib/api/types.js'

export const client = new Client({node: 'http://localhost:9200'})

export const INDEX_NAME = 'images'

export const indexSettings: IndicesCreateRequest = {
    index: INDEX_NAME,
    settings: {
        analysis: {
            analyzer: {
                english_analyzer: {
                    type: "custom",
                    tokenizer: "standard",
                    filter: [
                        "lowercase",
                        "english_stop",
                        "english_keywords",
                        "english_stemmer"
                    ]
                },
                russian_analyzer: {
                    type: "custom",
                    tokenizer: "standard",
                    filter: [
                        "lowercase",
                        "russian_stop",
                        "russian_keywords",
                        "russian_stemmer"
                    ]
                }
            },
            filter: {
                english_stop: {
                    type: "stop",
                    stopwords: "_english_"
                },
                english_keywords: {
                    type: "keyword_marker",
                    keywords: ["example"]
                },
                english_stemmer: {
                    type: "stemmer",
                    language: "english"
                },
                russian_stop: {
                    type: "stop",
                    stopwords: "_russian_"
                },
                russian_keywords: {
                    type: "keyword_marker",
                    keywords: ["пример"]
                },
                russian_stemmer: {
                    type: "stemmer",
                    language: "russian"
                }
            }
        }
    },
    mappings: {
        properties: {
            prompt: {
                type: "text",
                analyzer: "english_analyzer"
            },
            promptRu: {
                type: "text",
                analyzer: "russian_analyzer"
            }
        }
    }
}
