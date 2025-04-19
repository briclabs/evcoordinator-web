export class DeleteResponse {
  readonly #messages: Map<string, string>;

  constructor(
    messages: Map<string, string>
  ) {
    this.#messages = messages;
  }

  get messages(): Map<string, string> {
    return this.#messages;
  }

  private static isDeleteResponse(object: any): boolean {
    return object && typeof object === 'object' && 'messages' in object;
  }

  static getMessagesFromObject(object: any): Map<string, string> {
    if (DeleteResponse.isDeleteResponse(object)) {
      const deleteResponse: DeleteResponse = object as DeleteResponse;
      if (deleteResponse.messages instanceof Map) {
        return deleteResponse.messages;
      } else if (typeof deleteResponse.messages === 'object') {
        return new Map<string, string>(Object.entries(deleteResponse.messages));
      }
      return deleteResponse.messages;
    }
    console.log('Object was not of the correct type.')
    return new Map<string, string>();
  }
}
