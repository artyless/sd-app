import {Client} from '@elastic/elasticsearch'
import {IndicesCreateRequest} from '@elastic/elasticsearch/lib/api/types.js'

export const client = new Client({node: 'http://localhost:9200'})

export const INDEX_NAME = 'images'

export const indexSettings: IndicesCreateRequest = {
    index: INDEX_NAME,
    settings: {
        analysis: {
            analyzer: {
                custom_analyzer: {
                    type: "custom",
                    tokenizer: "standard",
                    filter: [
                        "lowercase",
                        "english_stop",
                        "english_keywords",
                        "english_stemmer"
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
                }
            }
        }
    },
    mappings: {
        properties: {
            prompt: {
                type: "text",
                analyzer: "custom_analyzer"
            }
        }
    }
}
