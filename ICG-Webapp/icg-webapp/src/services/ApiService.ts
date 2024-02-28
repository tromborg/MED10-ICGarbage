import { WebICGApiClient } from "../apicalls";

export class ApiService {
    private static _client: WebICGApiClient;

    static client(): WebICGApiClient {
        if (!ApiService._client){
            ApiService._client = new WebICGApiClient(
                process.env.REACT_APP_BASE_URL
            );
        }

        return this._client;
    }
}