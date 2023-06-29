## Запуск

Для запуска проекта нужно запустить docker-compose следующей командой `docker-compose up --build` и создать рядом с докер-композом файл `.env` и прокинуть туда переменные указанные в `.env.example` с значениями, которые вам комфортны, а для теста просто можно просто скопировать содержимое `.env.example` в `.env`

## Функциональность проекта.

В проекте имеются три роута которые требовались.

- Get /requests - возвращает все заявки, и активные и не активные.  
  К данному роуту прикручен фильтр, по любому полю сущности.
  Например:

      - /requests?filter=/status eq "Active" - возвращает все активные запросы
          - /requests?filter=/status neq "Active" - возвращает  запросы, которые не являются активными.
          - /requests?filter=/created_at lte "тут указываете дату" - возвращает записи которые были созданы до указанной даты.
          - /requests?filter=/id eq "айди запроса" - возвращает одну запись по айди.

  В общем фильтры работают так после / указываете название поля через пробел оператор еще через пробел значение.
  Доступные операторы: `eq, neq, in, nin, lte, gte, between`
  Для `in, nin` значения надо указать в массиве.  
  Фильтр находится не в идеальном состоянии, его можно и нужно доработать.  
  Также фильтрировать можно комбинированно, например

  - /requests?filter=/status eq "Active" and /created_at lte "тут указываете дату"

- Post requests - создаёт заявку, и если обязательные поля отсутствуют, выдастся исключение валидатора.
- Put requests/{id} - телезапроса указываете коммент и заявка станет резолвенной

### Резюме

В общем весь функционал реализованo, базово, много чего можно добавить, доработать, улучшить. Например сделать аутентификацию, авторизацию, etc
