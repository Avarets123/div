import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { NamespaceSettingsException } from '../exceptions/namespaceSettings.exception'

export interface Response<T> {
  data: T
}

@Injectable()
export class SettingsBatchPatchInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req = context.switchToHttp().getRequest()
    const params = Object.keys(req.params).map((param) => ({
      param,
      transformParam: param.toLocaleLowerCase(),
    }))
    const namespaceParam = params.find((p) =>
      p.transformParam.includes('namespace'),
    )
    const namespace = req.params[namespaceParam?.param]

    if (Array.isArray(req.body) && req.body.length) {
      req.body = { items: req.body }
      const settings = req.body.items.filter((item) => item.namespace)

      if (settings.length && namespace) {
        const incorrectSettings = settings.filter(
          (s) => s.namespace.toLowerCase() !== namespace.toLowerCase(),
        )
        if (incorrectSettings.length) {
          throw new NamespaceSettingsException()
        }
      }
    }

    if (req.body.namespace && namespace) {
      const incorrectSetting =
        req.body.namespace.toLowerCase() !== namespace.toLowerCase()
      if (incorrectSetting) {
        throw new NamespaceSettingsException()
      }
    }

    return next.handle().pipe()
  }
}
