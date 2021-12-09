
def build_pagination(page_number, page_size):
    offset_statement = " offset "+str(page_number)+" limit "+str(page_size)

    return offset_statement