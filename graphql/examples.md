1. open `http://localhost:4007/graphql`
2. paste into left field:
    ```graphql
    {
      BookshopService {
        Books {
          title
          chapters {
            number
            title
          }
        }
      }
    }
    ```
3. press play button