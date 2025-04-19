export class CreateResponse {
  readonly #insertedId: number;
  readonly #messages: Map<string, string>;
  constructor(
    insertedId: number,
    messages: Map<string, string>
  ) {
    this.#insertedId = insertedId;
    this.#messages = messages;
  }

  get insertedId(): number {
      return this.#insertedId;
    }

  get messages(): Map<string, string> {
    return this.#messages;
  }

  private static isCreateResponse(object: any): boolean {
    return object && typeof object === 'object' && 'messages' in object && 'insertedId' in object;
  }

  static getMessagesFromObject(object: any): Map<string, string> {
    if (CreateResponse.isCreateResponse(object)) {
      const createResponse: CreateResponse = object as CreateResponse;
      if (createResponse.messages instanceof Map) {
        return createResponse.messages;
      } else if (typeof createResponse.messages === 'object') {
        return new Map<string, string>(Object.entries(createResponse.messages));
      }
      return createResponse.messages;
    }
    console.log('Object was not of the correct type.')
    return new Map<string, string>();
  }
}
