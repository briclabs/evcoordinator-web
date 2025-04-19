export class UpdateResponse {
  readonly #numberOfRecordsUpdated: number;
  readonly #messages: Map<string, string>;

  constructor(
    numberOfRecordsUpdated: number,
    messages: Map<string, string>
  ) {
    this.#numberOfRecordsUpdated = numberOfRecordsUpdated;
    this.#messages = messages;
  }

  get numberOfRecordsUpdated(): number {
    return this.#numberOfRecordsUpdated;
  }

  get messages(): Map<string, string> {
    return this.#messages;
  }

  private static isUpdateResponse(object: any): boolean {
    return object && typeof object === 'object' && 'messages' in object && 'numberOfRecordsUpdated' in object;
  }

  static getMessagesFromObject(object: any): Map<string, string> {
    if (UpdateResponse.isUpdateResponse(object)) {
      const updateResponse: UpdateResponse = object as UpdateResponse;
      if (updateResponse.messages instanceof Map) {
        return updateResponse.messages;
      } else if (typeof updateResponse.messages === 'object') {
        return new Map<string, string>(Object.entries(updateResponse.messages));
      }
      return updateResponse.messages;
    }
    console.log('Object was not of the correct type.')
    return new Map<string, string>();
  }
}
