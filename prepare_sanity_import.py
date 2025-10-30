'''
import os
import json

def prepare_for_sanity():
    ndjson_path = 'import.ndjson'
    products_dir = 'import_products'

    with open(ndjson_path, 'w') as ndjson_file:
        for root, _, files in os.walk(products_dir):
            for file in files:
                if file == 'product.json':
                    file_path = os.path.join(root, file)
                    with open(file_path, 'r') as f:
                        try:
                            data = json.load(f)

                            # 1. Add _type
                            data['_type'] = 'product'

                            # 2. Use slug for _id
                            if 'slug' in data:
                                data['_id'] = data['slug']
                            else:
                                print(f"Skipping {file_path}, no slug found.")
                                continue
                            
                            # 3. Ensure price is a number
                            if 'price' in data and isinstance(data['price'], str):
                                try:
                                    data['price'] = int(data['price'])
                                except (ValueError, TypeError):
                                    print(f"Could not convert price to int for {file_path}. Removing price.")
                                    del data['price']
                            
                            # 4. Remove original image URLs, we will handle assets later
                            if 'images' in data:
                                del data['images']

                            ndjson_file.write(json.dumps(data) + '\n')

                        except json.JSONDecodeError:
                            print(f"Skipping {file_path} due to invalid JSON.")
                        except Exception as e:
                            print(f"An error occurred with {file_path}: {e}")
    print(f"Successfully created {ndjson_path}")

if __name__ == "__main__":
    prepare_for_sanity()
'''