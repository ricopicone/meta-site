import yaml
import argparse
import glob
import click
import os
from os.path import exists
import pathlib
import shutil
import filecmp
from natsort import natsorted
from collections import OrderedDict

# Load the _config.yml file
with open('_config.yml') as f:
    config = yaml.safe_load(f)

def texter(data,extraclasses='',pageurl=False,ishome=False):
    if data['v-specific'] in ['ts', 'ds', 'both'] and (data['type'] == 'subsection' or data['type'] == 'resource'):
        # Include the whole page for versioned subsections!
        return f'```include\ncommon/versioned/{data["hash"]}/source.md\n```'
    else:
        # Include a header
        title = data['title']
        if pageurl:
            title = f'[{title}](/{data["hash"]})'
        iden = pathlib.PurePath(data['id'])
        iden = iden.name
        if iden:
            iden = '#'+iden
        vs = data['v-specific']
        # print(f'data: {data}')
        if data['type'] == 'chapter' or data['type'] == 'appendix' or data['type'] == 'section' or data['type'] == 'lab':
            pounds = '#'
        elif data['type'] == 'subsection' or data['type'] == 'resource':
            pounds = '##'
        if vs=='ts':
            v = '.ts .'+data['v-ts']
        elif vs=='ds':
            v = '.ds .'+data['v-ds']
        elif vs=='both':
            v = '.ts .'+data['v-ts']+' .ds .'+data['v-ds']
        else:
            v = ''
        if not ishome and (data['type'] == 'chapter' or data['type'] == 'appendix'):
            extraclasses = extraclasses+' .chapterheader'
        if ishome:
            extraclasses = extraclasses+' .homepage'
        if 'wherein' not in data:
            data["wherein"] = ''
        return f'{pounds} {title} {{{iden} .faux {extraclasses} {v} h="{data["hash"]}"}}'
        # return f'{pounds} {title} {{{iden} .faux {extraclasses} {v} h="{data["hash"]}" wherein="{data["wherein"]}"}}'

def chapters_of_the_book(w=True):
    hashes = OrderedDict() # hashes of chapters
    numbers = [] # for sorting hashes
    ahashes = {} # apocryphal chapter hashes
    home_source = faux_base+'/0000/source.md'
    os.makedirs(os.path.dirname(home_source), exist_ok=True)
    for ed,tbl in book.items():
        for h,data in tbl.items():
            if isinstance(data,dict):
                if 'hash' in data:
                    if data['type'] == 'chapter' or data['type'] == 'appendix':
                        ch = data['ch'] # chapter number
                        ed = data['ed'] # edition
                        h_canon = data['hash']
                        hashes[h] = data;
                        numbers.append(ch)
    hashes_sort = [x for _,x in natsorted(zip(numbers,hashes.keys()))]
    for h in hashes_sort:
        data = hashes[h]
        ch = data['ch'] # chapter number
        ed = data['ed'] # edition
        # generate faux home/index source
        if exists(home_source):
            if chapters_of_the_book.counter > 0:
                writemode = 'a' # append after first write
            else:
                writemode = 'w' # for first write
            chapters_of_the_book.counter += 1
        else:
            writemode = 'w'
        with open(home_source, writemode) as f:
            f.write('\n\n'+texter(data,pageurl=True,ishome=True))
            if apocrypha_tf:
                for h,d in apocrypha.items():
                    if h in hashes: # if there's an apocryphal copy of this canon chapter ... this doesn't support apocryphal chapters that have hashes that don't also appear in some canonical book ... not much of a limitation considering this is just for the toc
                        for sh,sd in d.items(): # subhashes
                            if h in ahashes:
                                ahashes[h].append(sh)
                            else:
                                ahashes[h] = [sh]
                            f.write('\n\n'+texter(sd,pageurl=True,ishome=True))
    return hashes,ahashes

chapters_of_the_book.counter = 0

def sections_of_this_chapter(data):
    if not (data['type'] == 'chapter' or data['type'] == 'appendix'):
        return []
    ch = data['ch'] # chapter number
    ed = data['ed'] # edition
    hashes = [] # hashes of sections of this chapter
    numbers = [] # for sorting hashes
    for h,d in book[ed].items():
        if isinstance(d,dict):
            if 'hash' in data:
                if 'type' in d:
                    if d['type'] == 'section' or d['type'] == 'lab':
                        sec = d['sec']
                        if sec.startswith(ch+'.') or sec.startswith('L'+ch):
                            hashes.append(h)
                            numbers.append(sec)
    hashes = [x for _,x in natsorted(zip(numbers,hashes))] # sorted by number
    ahashes = {} # apocryphal hashes of sections of this chapter
    if apocrypha_tf:
        print('\n\nAPOCRYPHA\n\n')
        for h,d in apocrypha.items():
            if h in hashes: # if there's an apocryphal copy of this canon section ... this doesn't support apocryphal sections that have hashes that don't also appear in some canonical book ... not much of a limitation considering this is just for toc chapter pages
                for sh,sd in d.items(): # subhashes
                    if h in ahashes:
                        ahashes[h].append(sh)
                    else:
                        ahashes[h] = [sh]
    return hashes,ahashes

def subsections_of_this_section(data):
    if not data['type'] == 'section':
        return []
    sec = data['sec'] # section number
    ed = data['ed'] # edition
    hashes = [] # hashes of subsections of this section
    numbers = [] # for sorting hashes
    for h,d in book[ed].items():
        if isinstance(d,dict):
            if 'hash' in data:
                if 'type' in d:
                    if d['type'] == 'subsection' or d['type'] == 'resource':
                        # print(f'd: {d}\n')
                        subsec = d['subsec']
                        if subsec.startswith(sec+'.'):
                            hashes.append(h)
                            numbers.append(subsec)
    hashes = [x for _,x in natsorted(zip(numbers,hashes))] # sorted by number
    ahashes = {} # apocryphal hashes of subsections of this section
    if apocrypha_tf:
        for h,d in apocrypha.items():
            if h in hashes: # if there's an apocryphal copy of this canon section ... this doesn't support apocryphal sections that have hashes that don't also appear in some canonical book ... not much of a limitation considering this is just for toc chapter pages
                for sh,sd in d.items(): # subhashes
                    if h in ahashes:
                        ahashes[h].append(sh)
                    else:
                        ahashes[h] = [sh]
    return hashes,ahashes

def preview_text(data, ed=''):
    if data['type'] == 'chapter' or data['type'] == 'appendix':
        num = data['ch']
    elif data['type'] == 'section':
        num = data['sec']
    elif data['type'] == 'lab':
        num = data['sec']
    elif data['type'] == 'resource' or data['type'] == 'subsection':
        num = data['subsec']
    else:
        num = ''
    # Get book-short-name and url-publisher of this edition of the book
    if ed:
        book_short_name = book_defs['book-short-name']
        publisher = book_defs['editions'][ed]['publisher']
        url_publisher = book_defs['editions'][ed]['url-publisher']
        preview_text_config = config['preview_text'].format(type=data['type'], num=num, book_short_name=book_short_name, publisher=publisher, url_publisher=url_publisher)
    else:
        preview_text_config = config['preview_text'].format(type=data['type'], num=num)
    return f'\n\n::: {{ .infobox title="{data["type"]} {num} companion and outline"}}\n{preview_text_config}\n:::\n\n'

def online_resourcer(data):
    if data['type'] == 'chapter':
        pounds = '#'
        number = f'Chapter {data["ch"]}'
    elif data['type'] == 'appendix':
        pounds = '#'
        number = f'Appendix {data["ch"]}'
    elif data['type'] == 'section' or data['type'] == 'lab':
        pounds = '##'
        if data['type'] == 'section':
            number = f'Section {data["sec"]}'
        else:
            number = f'Lab {data["ch"]}'
    elif data['type'] == 'subsection' or data['type'] == 'resource':
        pounds = '###'
        if data['type'] == 'subsection':
            number = f'Section {data["subsec"]}'
        else:
            number = f'Resource {data["subsec"]}'
    title = f'Online resources for {number}'
    iden = pathlib.PurePath(data['id'])
    iden = iden.name
    if iden:
        iden = '#'+iden+'-online-resources'
    else:
        iden = '#online-resources'
    resources_editable = f'\n\n```include\n{data["source_reso"]}\n```'
    return f'\n\n{pounds} {title} {{{iden} .online-resources h="{data["hash"]}-online-resources"}}\n{resources_editable}'


with open('common/book-defs.json') as f:
    book_defs = yaml.safe_load(f)

book = {}
for ed,details in book_defs['editions'].items():
    if exists(details['json-file-cleaned']):
        with open(details['json-file-cleaned']) as f:
            book[ed] = yaml.safe_load(f)

apocrypha_tf = False
# if exists(book_defs['apocrypha']): # having trouble with apocrypha doubling up sections listed on toc pages ... disabling for now
#     with open(book_defs['apocrypha']) as f:
#         apocrypha = yaml.safe_load(f)
#         apocrypha_tf = True

path_base = 'common/versioned'
faux_base = 'common/faux'
reso_base = 'common/online-resources-editable'
paths = {}
# add hash and data to paths
for ed,tbl in book.items():
    for h,data in tbl.items():
        if isinstance(data,dict):
            if 'hash' in data:
                path = path_base + '/' + h
                faux = faux_base + '/' + h
                reso = reso_base + '/' + h
                if data['type']=='chapter' or data['type']=='appendix' or data['type']=='section' or data['type']=='subsection' or data['type']=='lab' or data['type']=='resource':
                    data['source_path'] = path + "/source.md"
                    data['source_faux'] = faux + "/source.md"
                    data['source_reso'] = reso + "/source.md"
                    data['ed'] = ed
                    paths[path] = data # this will overwrite some values when there are multiple editions ... this is pretty benign because the lua filter will still populate the numbering and pagination properly. If in the editions the values set by texter() differ, which seems unlikely, some will get overwritten.


# generate online resource source (manually editable) if it doesn't already exist
for path, data in paths.items():
    if not exists(data['source_reso']): # otherwise don't touch it
        os.makedirs(os.path.dirname(data['source_reso']), exist_ok=True)
        with open(data['source_reso'],'w') as f:
            f.write('\nNo online resources.\n')

# generate faux sources
for path, data in paths.items():
    if not exists(data['source_path']): # then it needs a faux version
        os.makedirs(os.path.dirname(data['source_faux']), exist_ok=True)
        # with open(data['source_faux']+'_tmp', 'a') as f:
        #     f.write(preview_text(data))
        if exists(data['source_faux']+'_tmp'):
            with open(data['source_faux']+'_tmp', 'a') as f:
                f.write('\n\n'+texter(data))
        else:
            with open(data['source_faux']+'_tmp', 'w') as f:
                f.write(preview_text(data, ed=data['ed']))  # Preview text says the real content is in the book
                f.write(texter(data))
                if data['type'] != 'chapter' and data['type'] != 'appendix' and data['type'] != 'section':
                    f.write(online_resourcer(data))
        # make chapter pages tocs
        if data['type'] == 'chapter' or data['type'] == 'appendix': 
            with open(data['source_faux']+'_tmp', 'a') as f:
                # check for lead-in text and insert if it exists
                for ed,tbl in book.items():
                    if isinstance(tbl,dict):
                        h_lead = f'{data["hash"]}-lead-in'
                        lead_path = f'common/versioned/{h_lead}/source.md'
                        if exists(lead_path):
                            f.write(f'\n\n```include\n{lead_path}\n\n```')
                # make sections outline
                hs,hsa = sections_of_this_chapter(data)
                for h in hs:
                    f.write('\n\n'+texter(book[data['ed']][h],pageurl=True))
                    if apocrypha_tf and h in hsa:
                        for sh in hsa[h]:
                            # print(apocrypha[h][sh])
                            f.write('\n\n'+texter(apocrypha[h][sh],pageurl=True))
                f.write(online_resourcer(data))
        # make section pages tocs
        if data['type'] == 'section': 
            with open(data['source_faux']+'_tmp', 'a') as f:
                hs,hsa = subsections_of_this_section(data)
                for h in hs:
                    f.write('\n\n'+texter(book[data['ed']][h]))
                    if apocrypha_tf and h in hsa:
                        for sh in hsa[h]:
                            f.write('\n\n'+texter(apocrypha[h][sh]))
                f.write(online_resourcer(data))
        if exists(data['source_faux']):
            # print('banana '+data['source_faux'])
            # print(data['source_faux']+'_tmp')
            comp = filecmp.cmp(data['source_faux'], data['source_faux']+'_tmp', shallow = False)
            # print(comp)
        else:
            comp = False
        if not comp:
            print(f'- overwriting: {data["source_faux"]}')
            os.replace(data['source_faux']+'_tmp',data['source_faux'])
        else:
            os.remove(data['source_faux']+'_tmp')

chapters_of_the_book(w=True) # generate chapter toc for home/index

exit(0)
