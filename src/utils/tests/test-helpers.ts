import { DefaultBodyType, MockedRequest, RequestHandler } from 'msw'
import { setupServer, SetupServerApi } from 'msw/node'
import { beforeEach, expect } from 'vitest'
import pick from 'lodash/pick'

export interface CapturedRequest {
  method: string
  host: string
  pathname: string
  query: Record<string, string[]>
  headers: Record<string, string>
  body: DefaultBodyType
}

interface MockApiReturnType {
  capturedRequests: () => CapturedRequest[]
  capturedRequestParts: (props: (keyof CapturedRequest)[]) => Partial<CapturedRequest>[]
  overrideHandler: (...requestHandlers: RequestHandler[]) => void
}

function capture(req: MockedRequest): CapturedRequest {
  const { host, pathname } = req.url

  const query: Record<string, string[]> = {}
  for (const name of Array.from(req.url.searchParams.keys())) {
    query[name] = req.url.searchParams.getAll(name)
  }

  return {
    method: req.method,
    host,
    pathname,
    query,
    headers: req.headers.all(),
    body: req.body,
  }
}

export function mockApiForJest(...requestHandlers: RequestHandler[]): MockApiReturnType {
  let worker: SetupServerApi | null = null
  let capturedRequests: CapturedRequest[] = []

  beforeEach(() => {
    worker = setupServer(...requestHandlers)
    worker.events.on('request:start', (request) => {
      capturedRequests.push(capture(request))
    })
    worker.listen({ onUnhandledRequest: 'error' })

    capturedRequests = []
  })

  afterEach(() => {
    if (worker != null) {
      worker.close()
    }
  })

  return {
    capturedRequests() {
      return capturedRequests
    },
    capturedRequestParts(props) {
      return capturedRequests.map((request) => {
        return pick(request, props)
      })
    },
    overrideHandler(...requestHandlers: RequestHandler[]) {
      worker?.use(...requestHandlers)
    },
  }
}

export function requestMatching(partialRequest: Partial<CapturedRequest>): unknown {
  return expect.objectContaining(partialRequest)
}
